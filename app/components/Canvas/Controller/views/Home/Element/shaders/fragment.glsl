#define PI 3.14159265359

uniform float u_time; 
uniform float u_size;
uniform float u_mouse_size; 
uniform float u_cam_pos; 
uniform float u_time_factor;

uniform vec2 u_mouse; 
uniform vec2 u_scale; 
uniform vec2 u_box_size; 

uniform vec3 u_color; 

varying vec2 v_uv; 

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float smin( float a, float b, float k )
{
    float h = a-b;
    return 0.5*( (a+b) - sqrt(h*h+k) );
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdSphere(vec3 p, float r) 
{
    return length(p)-r;
}

float noise(vec3 p)
{
    return 8. - (sin(p.x) + cos(p.y) + sin(p.z)) / 0.8; 
}

float scene(vec3 p)
{
    vec3 p1 = rotate(p, vec3(1., 1., 1.), 1.3 + (sin(PI * 2.0) + u_time * u_time_factor));
    float scale = 200. + 10. * sin(6.); 
    float main = max(sdBox(p1, vec3(u_box_size.x, u_box_size.y, 0.125) - vec3(u_size)), (noise(p1 * scale)) / scale);
    float mouse_sphere = sdSphere(p - vec3(u_mouse, .0), 0.02 - u_mouse_size);
    return smin(main, mouse_sphere, 0.03);
}

vec3 getNormal(vec3 p){
	
	vec2 o = vec2(0.001,0.);
	// 0.001,0,0
	return normalize(
		vec3(
			scene(p + o.xyy) - scene(p - o.xyy),
			scene(p + o.yxy) - scene(p - o.yxy),
			scene(p + o.yyx) - scene(p - o.yyx)
		)
	);
}

vec3 GetColorAmount(vec3 p)
{
    float amount = clamp((0.85 - length(p)) / .6, .1, .5); 
    vec3 col = 0.5 + 0.5 * cos((PI * 2.) * (vec3(0.6, 0.4, 0.2) + amount * u_color));
    return col * amount;
}

void main()
{
    vec2 new_uv = (v_uv - vec2(0.5)) / u_scale + vec2(0.5);

    vec2 point = new_uv - vec2(0.5); 

    vec3 cam_pos = vec3(0., 0., u_cam_pos);
    vec3 ray = normalize(vec3(point, -1.0));
    vec3 ray_pos = cam_pos; 

    float cur_dist = 0.; 
    float ray_len = 0.; 

    vec3 light = vec3(-1., 1., 1.);
    vec4 color = vec4(0.0);

    for(int i = 0; i<=40; i++)
    {
        cur_dist = scene(ray_pos);
        ray_len += .8 * cur_dist; 

        ray_pos = cam_pos + ray*ray_len; 

        if(abs(cur_dist)<0.001 || ray_len>5.)
        {
            vec3 n = getNormal(ray_pos);

            float diff = dot(n, light);

            break;
        }

        color.rgb += 0.03 * GetColorAmount(ray_pos);
        color.a = 0.0; 
    }

    gl_FragColor = color;
}