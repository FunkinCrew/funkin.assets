#pragma header

// Value from (0, 1)
uniform float amount;

// Converts the input image to grayscale, with `amount` representing the proportion of the conversion.

// See https://drafts.fxtf.org/filter-effects/#grayscaleEquivalent
vec4 to_grayscale(vec4 input) {
    float red = (0.2126 + 0.7874 * (1 - amount)) * input.r + (0.7152 - 0.7152  * (1 - amount)) * input.g + (0.0722 - 0.0722 * (1 - amount)) * input.b;
    float green = (0.2126 - 0.2126 * (1 - amount)) * input.r + (0.7152 + 0.2848  * (1 - amount)) * input.g + (0.0722 - 0.0722 * (1 - amount)) * input.b;
    float blue = (0.2126 - 0.2126 * (1 - amount)) * input.r + (0.7152 - 0.7152  * (1 - amount)) * input.g + (0.0722 + 0.9278 * (1 - amount)) * input.b;

    return vec4(red, green, blue, input.a);
}

void main() {
	// Get the texture to apply to.
	vec4 color = flixel_texture2D(bitmap, openfl_TextureCoordv);

	// Apply the darken effect.
	color = to_grayscale(color);

    // Return the value.
	gl_FragColor = color;
}