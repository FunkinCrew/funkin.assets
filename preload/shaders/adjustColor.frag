#pragma header

// this shader includes a recreation of the Animate/Flash "Adjust Color" filter,
// which was kindly provided and written by Rozebud https://github.com/ThatRozebudDude ( thank u rozebud :) )
// Adapted from Andrey-Postelzhuks shader found here: https://forum.unity.com/threads/hue-saturation-brightness-contrast-shader.260649/
// Hue rotation stuff is from here: https://www.w3.org/TR/filter-effects/#feColorMatrixElement

uniform mat3 hueMatrix;
uniform float contrast;
uniform mat3 saturationMatrix;
uniform float brightness;

vec3 applyHSBCEffect(vec3 color)
{
	vec3 bh = (brightness + color) * hueMatrix;
	vec3 c = (bh - 0.25) * contrast + 0.25;
	vec3 s = c * saturationMatrix;

	return s;
}

void main()
{
	vec4 color4 = texture2D(bitmap, openfl_TextureCoordv);
	vec3 color3 = color4.a > 0.0 ? color4.rgb / color4.a : color4.rgb;

	color3 = applyHSBCEffect(color3);

	gl_FragColor = vec4(color3 * color4.a, color4.a);
}
