#include <fog_pars_fragment>
varying vec2 vUv;
varying vec3 vColor;

uniform sampler2D uTexture;

void main() {
    float contrast = 1.0;

    vec3 color = texture2D(uTexture, vUv).rgb * contrast;
    color *= vColor;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>

    #include <fog_fragment>
}