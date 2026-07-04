#pragma header

uniform vec3 uTargetColor;
uniform vec3 uReplaceColor;
uniform float uThreshold;

void main()
{
	vec4 color = flixel_texture2D(bitmap, openfl_TextureCoordv);

	if (color.a > 0.0)
	{
		vec3 c = color.rgb / color.a;

		float dist = distance(c, uTargetColor);
		float blend = 1.0 - smoothstep(uThreshold * 0.5, uThreshold, dist);

		color.rgb = mix(c, uReplaceColor, blend) * color.a;
	}

	gl_FragColor = color;
}
