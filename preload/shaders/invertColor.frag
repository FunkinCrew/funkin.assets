#pragma header

// The invert blend mode inverts each pixel's color.

void main() {
	// Get the texture to apply to.
	vec4 color = flixel_texture2D(bitmap, openfl_TextureCoordv);

	color.r = (1.0 - color.r)-(1.0-color.a);
	color.g = (1.0 - color.g)-(1.0-color.a);
	color.b = (1.0 - color.b)-(1.0-color.a);

  // Return the value.
	gl_FragColor = color;
}
