#pragma header

uniform vec3 uTargetColor;
uniform vec3 uReplaceColor;
uniform float uThreshold;

vec3 rgb2hsv(vec3 c)
{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float hueDist(float a, float b)
{
	float d = abs(a - b);
	return min(d, 1.0 - d);
}

void main()
{
	vec4 color = flixel_texture2D(bitmap, openfl_TextureCoordv);

	if (color.a > 0.0)
	{
		vec3 hsv = rgb2hsv(color.rgb / color.a);
		vec3 targetHsv = rgb2hsv(uTargetColor);
		vec3 replaceHsv = rgb2hsv(uReplaceColor);

		float dist = hueDist(hsv.x, targetHsv.x);
		float blend = (1.0 - smoothstep(uThreshold * 0.5, uThreshold, dist)) * step(0.05, hsv.y);

		hsv.x = mix(hsv.x, replaceHsv.x, blend);
		hsv.y = mix(hsv.y, hsv.y * (replaceHsv.y / max(targetHsv.y, 1.0e-4)), blend);
		hsv.z = mix(hsv.z, hsv.z * (replaceHsv.z / max(targetHsv.z, 1.0e-4)), blend);

		color.rgb = hsv2rgb(vec3(hsv.x, clamp(hsv.y, 0.0, 1.0), clamp(hsv.z, 0.0, 1.0))) * color.a;
	}

	gl_FragColor = color;
}
