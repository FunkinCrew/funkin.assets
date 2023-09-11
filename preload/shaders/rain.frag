
#pragma header






//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20201014 (stegu)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
	const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
	const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

	// First corner
	vec3 i  = floor(v + dot(v, C.yyy) );
	vec3 x0 =   v - i + dot(i, C.xxx) ;

	// Other corners
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.0 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );

	//   x0 = x0 - 0.0 + 0.0 * C.xxx;
	//   x1 = x0 - i1  + 1.0 * C.xxx;
	//   x2 = x0 - i2  + 2.0 * C.xxx;
	//   x3 = x0 - 1.0 + 3.0 * C.xxx;
	vec3 x1 = x0 - i1 + C.xxx;
	vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
	vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

	// Permutations
	i = mod289(i);
	vec4 p = permute( permute( permute(
				i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
			+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
			+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

	// Gradients: 7x7 points over a square, mapped onto an octahedron.
	// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
	float n_ = 0.142857142857; // 1.0/7.0
	vec3  ns = n_ * D.wyz - D.xzx;

	vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.0 - abs(x) - abs(y);

	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );

	//vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
	//vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
	vec4 s0 = floor(b0)*2.0 + 1.0;
	vec4 s1 = floor(b1)*2.0 + 1.0;
	vec4 sh = -step(h, vec4(0.0));

	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);

	//Normalise gradients
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;

	// Mix final noise value
	vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
	m = m * m;
	return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
									dot(p2,x2), dot(p3,x3) ) );
}










struct Light {
	vec2 position;
	vec3 color;
	float radius;
};

// prevent auto field generation
#define UNIFORM uniform

uniform float uTime;

uniform bool hasGroundMap = false;
uniform bool hasLightMap = false;
uniform sampler2D uGroundMap;
uniform sampler2D uLightMap;
uniform sampler2D uPuddleMap;

uniform int numLights;
const int MAX_LIGHTS = 8;
UNIFORM Light lights[MAX_LIGHTS];

// float mod(float a, float b) {
// 	return a - floor(a / b) * b;
// }

// vec2 mod(vec2 a, vec2 b) {
// 	return a - floor(a / b) * b;
// }

// vec2 mod(vec2 a, float b) {
// 	return a - floor(a / b) * b;
// }

float rand(vec2 a) {
	return fract(sin(dot(mod(a, vec2(1000.0)).xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float ease(float t) {
	return t * t * (3.0 - 2.0 * t);
}

float rainDist(vec2 p, float scale, float amount) {
	p *= 40.0;
	p.x += p.y * 0.1;
	p.y -= uTime * 500.0 / scale;
	p.y *= 0.03;
	float ix = floor(p.x);
	p.y += mod(ix, 2.0) * 0.5 + (rand(vec2(ix)) - 0.5) * 0.3;
	float iy = floor(p.y);
	vec2 index = vec2(ix, iy);
	p -= index;
	p.x += (rand(index.yx) * 2.0 - 1.0) * 0.35;
	vec2 a = abs(p - 0.5);
	float res = max(a.x, a.y * 0.5) - 0.1;
	bool empty = rand(index) < mix(1.0, 0.1, amount);
	return empty ? 1.0 : res;
}

vec2 groundDisplace(vec2 p, float amount) {
	vec2 res = vec2(0);
	p *= 70.0;
	float speed = 10.0;
	res.x = snoise(vec3(p, speed * uTime));
	res.y = snoise(vec3(p * vec2(1, 1.4), speed * uTime + 100.0));
	res *= 0.05 * mix(0.1, 1.0, amount);
	return res;
}

vec3 lightUp(vec2 p) {
	vec3 res = vec3(0);
	for (int i = 0; i < MAX_LIGHTS; i++) {
		if (i >= numLights) {
			break;
		}
		vec2 lp = lights[i].position;
		vec3 lc = lights[i].color;
		float lr = lights[i].radius;
		float w = max(0.0, 1.0 - length(lp - p) / lr);
		res += ease(w) * lc;
	}
	return res;
}

void main() {
	vec2 origUv = openfl_TextureCoordv;
	vec2 uv = fragCoord;
	vec2 pos = screenPos;
	vec2 uvSize = texCoordSize();

	// float amount = 0.5 + sin(uTime * 2.0) * 0.5;
	float amount = 0.5;

	vec3 add = vec3(0);
	float rainSum = 0.0;

	const int numLayers = 4;
	float scales[4];
	scales[0] = 1.0;
	scales[1] = 1.8;
	scales[2] = 2.6;
	scales[3] = 4.8;

	for (int i = 0; i < numLayers; i++) {
		float scale = scales[i];
		float r = rainDist(pos * scale + 500.0 * float(i), scale, amount);
		if (r < 0.0) {
			float v = (1.0 - exp(r * 5.0)) / scale * 2.0;
			uv.x += v * 0.02;
			uv.y -= v * 0.01;
			add += vec3(0.1, 0.15, 0.2) * v;
			rainSum += (1.0 - rainSum) * 0.75;
		}
	}
	uv = clamp(uv, vec2(0), vec2(1));

	vec3 light =  (texture2D(uLightMap, fragCoord).xyz + lightUp(pos)) * amount;

	bool isGround = false;
  if (hasGroundMap) {
    isGround = texture2D(uGroundMap, uv).x > 0.5;
  }

	bool isPuddle = texture2D(uPuddleMap, uv).x > 0.5;

	vec3 color = texture2D(bitmap, mod(uv, 1.0) * uvSize).xyz;

	if (isGround) {
		float mirror = 0.7;
		vec2 uv2 = vec2(uv.x, mirror - (uv.y - mirror));
		uv2 += groundDisplace(uv, amount);
		vec3 reflection = texture2D(bitmap, mod(uv2, 1.0) * uvSize).xyz;
		float reflectionRatio = mix(0.0, 0.25, amount);
		color = mix(color, reflection, reflectionRatio);
	}

	if (isPuddle)
	{
		float mirror = 0.7;
		vec2 uv2 = vec2(uv.x, mirror - (uv.y - mirror));
		uv2 += groundDisplace(uv, amount);
		vec3 reflection = texture2D(bitmap, mod(uv2, 1.0) * uvSize).xyz;
		float reflectionRatio = mix(0.0, 0.25, amount);
		color = mix(color, reflection, reflectionRatio);
	}

	vec3 rainColor = vec3(0.4, 0.5, 0.8);
	color += add;
	color = mix(color, rainColor, 0.1 * rainSum);

  vec3 fog = vec3(0.5 + rainSum * 0.5);

  if (hasLightMap)
  {
    fog = light * (0.5 + rainSum * 0.5);
  }
	// color = color / (1.0 + fog) + fog;

	gl_FragColor = vec4(color, 1);
	// gl_FragColor = vec4(fragCoord, 0, 1);
}
