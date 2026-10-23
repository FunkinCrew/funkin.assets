#pragma header

#ifdef GL_ES
 	#ifdef GL_OES_standard_derivatives
		#define HAS_DERIVATIVES
 	#endif
#else
 	#if __VERSION__ >= 130
		#define HAS_DERIVATIVES
 	#endif
#endif

// This shader aims to mostly recreate how Adobe Animate/Flash handles drop shadows, but its main use here is for rim lighting.

// this shader also includes a recreation of the Animate/Flash "Adjust Color" filter,
// which was kindly provided and written by Rozebud https://github.com/ThatRozebudDude ( thank u rozebud :) )
// Adapted from Andrey-Postelzhuks shader found here: https://forum.unity.com/threads/hue-saturation-brightness-contrast-shader.260649/
// Hue rotation stuff is from here: https://www.w3.org/TR/filter-effects/#feColorMatrixElement

// equals (frame.left, frame.top, frame.right, frame.bottom)
uniform vec4 uFrameBounds;

uniform float dist;
uniform float str;
uniform float thr;

uniform vec2 ang;

uniform sampler2D altMask;
uniform bool useMask;
uniform float thr2;

uniform vec3 dropColor;

uniform mat3 hueMatrix;
uniform float contrast;
uniform mat3 saturationMatrix;
uniform float brightness;

uniform bool enable_antialiasing;

const vec3 lumaValue = vec3(0.2126, 0.7152, 0.0722);

vec3 applyHSBCEffect(vec3 color)
{
 	vec3 bh = (brightness + color) * hueMatrix;
 	vec3 c = (bh - 0.25) * contrast + 0.25;
 	vec3 s = c * saturationMatrix;

 	return s;
}

float getLumaRGB(vec3 color)
{
 	return dot(color.rgb, lumaValue);
}

vec4 getTexRGBA(vec2 uv)
{
 	return flixel_texture2D(bitmap, uv);
}

float getLumaTex(vec2 uv)
{
 	return getLumaRGB(getTexRGBA(uv).rgb);
}

// Used as Difference Based AA.
// Return value range (0.0, 2.0)
float lwidth_manual(float center, vec2 uv, vec2 px)
{
 	if (!enable_antialiasing)
		return 0.0;

 	vec3 p2x1 = getTexRGBA(uv + vec2( 1.0,  0.0) * px).rgb;
 	vec3 p1x2 = getTexRGBA(uv + vec2( 0.0,  1.0) * px).rgb;
 	vec3 p2x2 = getTexRGBA(uv + vec2( 1.0,  1.0) * px).rgb;

 	float right     = getLumaRGB(p2x1);
 	float down      = getLumaRGB(p1x2);
 	float diagonal  = getLumaRGB(p2x2);

 	float dx = abs(right - center);
 	float dy = abs(down - center);
 	float dd = abs(diagonal - center);

 	return ((dx + dy + dd * 0.7) / (1.0 + 1.0 + 0.7)) * 2.0;
}

// ============================
// THRESHOLD
// ============================

float getThreshold(vec2 uv)
{
 	float threshold = thr;
 	float maskIntensity = 0.0;

 	if (useMask)
 	{
		maskIntensity = texture2D(altMask, uv).b;

		float maskCondition = float(maskIntensity > 0.0);
		threshold = (thr2 * maskCondition) + (threshold * (1.0 - maskCondition));
 	}

 	return threshold;
}

// ============================
// DROP SHADOW / RIM
// ============================

vec4 createDropShadowEx(vec2 uv, vec2 ratio, vec2 size)
{
 	vec4 color4 = getTexRGBA(uv);

#ifdef HAS_DERIVATIVES
	// Increase the pixel distance if the screen is smaller than the sprite!
	vec2 px = max(ratio, fwidth(uv));
#else
	vec2 px = ratio;
#endif

 	float color3_light = getLumaRGB(color4.rgb);

 	float delta = lwidth_manual(color3_light, uv, px);

 	float threshold = getThreshold(uv);
 	float intensity = smoothstep(threshold - delta, threshold + delta, color3_light);

 	float shadowAlpha = 0.0;

 	vec3 color3_no_effect = color4.a > 0.0 ? color4.rgb / color4.a : color4.rgb;
 	vec3 color3 = applyHSBCEffect(color3_no_effect);

 	vec2 checked = vec2(
		uv.x + (dist * ang.x * ratio.x),
		uv.y - (dist * ang.y * ratio.y)
 	);

 	if (checked.x > uFrameBounds.x &&
	 	checked.y > uFrameBounds.y &&
	 	checked.x < uFrameBounds.z &&
	 	checked.y < uFrameBounds.w)
 	{
		shadowAlpha = texture2D(bitmap, checked).a;
 	}

 	float rim = (str - (shadowAlpha * str)) * intensity;

 	color3 += dropColor * rim;

 	return vec4(color3 * color4.a, color4.a);
}

void main()
{
 	gl_FragColor = createDropShadowEx(openfl_TextureCoordv, 1.0 / openfl_TextureSize.xy, openfl_TextureSize.xy);
}
