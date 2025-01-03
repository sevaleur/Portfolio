uniform sampler2D tMap;

uniform float uAlpha;

uniform vec2 uPlaneSize;
uniform vec2 uImageSize;

varying vec2 vUv;

float rand(vec2 co)
{
  return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
  vec2 ratio = vec2(
    min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
    min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1. - ratio.x) * .5,
    vUv.y * ratio.y + (1. - ratio.y) * .5
  );

  float resolution = 15.0;

  vec2 lowresxy = vec2(
    floor(gl_FragCoord.x / resolution),
    floor(gl_FragCoord.y / resolution)
  );

  vec4 t1 = texture2D(tMap, uv);

  gl_FragColor = t1;
  gl_FragColor.a = uAlpha;

  if(uAlpha > rand(lowresxy))
  {
    gl_FragColor.a = 1.0;
  }
  else
  {
    gl_FragColor.a = 0.0; 
  }
}