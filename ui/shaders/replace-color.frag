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

		if (distance(c, uTargetColor) <= uThreshold)
		{
			color.rgb = uReplaceColor * color.a;
		}
	}

	gl_FragColor = color;
}
