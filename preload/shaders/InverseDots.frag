#pragma header

// Rather than invert the entire color, we invert a sorta dots / dither pattern
// Inspiration from when an object in Adobe Flash is selected

uniform float _amount;

vec4 dots(vec4 color) {
  float xPix = floor(openfl_TextureCoordv.x * openfl_TextureSize.x );
  float yPix = floor(openfl_TextureCoordv.y * openfl_TextureSize.y);

  int x = int(mod(xPix, 6.0));
  int y = int(mod(yPix, 4.0));

  if (color.a > 0.0 && ((x == 0.0 && y == 0.0) || (x == 3.0 && y == 2.0)))
  {
    color.rgb = 1.0 - color.rgb;
  }



  return color;
}


void main() {
	// Get the texture to apply to.
	vec4 color = flixel_texture2D(bitmap, openfl_TextureCoordv);


  color = mix(color, dots(color), _amount);

  // Return the value.
	gl_FragColor = color;
}
