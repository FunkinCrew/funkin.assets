#pragma header

/**
 * The glow intensity. (0.0-1.0)
 */
uniform float uAmount;
/**
 * How long one full pulse lasts, in seconds
 */
uniform float uDuration;
/**
 * The current time. Used to shift the effect over time.
 */
uniform float uTime;

void main() {
    vec4 color = flixel_texture2D(bitmap, openfl_TextureCoordv);

    if (color.a == 0.0 || uAmount <= 0.0 || uDuration <= 0.0) {
        gl_FragColor = color;
        return;
    }

    float phase = mod(uTime, uDuration) / uDuration;

    float pulse = sin(phase * 6.28318); // 2 * PI
    pulse = 0.5 + 0.5 * pulse;

    float glow = pulse * uAmount;
    vec3 brightened = mix(color.rgb, vec3(1.0), glow * 0.6);
    brightened *= (1.0 + glow * 0.5);

    gl_FragColor = vec4(brightened, color.a);
}
