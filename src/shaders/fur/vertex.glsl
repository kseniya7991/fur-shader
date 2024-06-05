#include <fog_pars_vertex>
attribute vec3 color;

uniform vec2 uMouse;
uniform vec3 uMouseTest;
uniform float uWaveSize;
uniform float uBlowRadius;
uniform float uTime;
uniform float uBladeHeight;

varying vec2 vUv;
varying vec3 vColor;

#include ../includes/random.glsl;

void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    vec3 newPos = position;

    float tipDistance = 1.0;
    float addForce = 0.0;

    // Calc offset
    vec2 offset = uv - uMouse;

    // Calc offset radius and angle
    float radius = length(offset);

    float angle = atan(offset.y, offset.x) + random(uv.y);

    // "Blow" effect force

    if(radius < uBlowRadius) {
        addForce = max(0.2, 1.5 - uBladeHeight);
        angle += sin(uTime * 5.0 * random(uv.y)) * 0.4;
        tipDistance = 0.5;
    }

    float force = newPos.y * newPos.y * addForce;

    // Calc radial displacement
    vec2 radialDisplacement = vec2(cos(angle), sin(angle)) * force;

    // Set displacements to position
    newPos.x += newPos.y * newPos.y * sin(uTime * 2.0 + uv.x * uWaveSize + uv.y * uWaveSize * 3.0) * sin(uTime * 1.0 + uv.x * uWaveSize * 0.3 + uv.y * uWaveSize * 1.0) * tipDistance;
    newPos.xz += radialDisplacement;

    // Position
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    //Varying
    vUv = uv;
    vColor = color;
}