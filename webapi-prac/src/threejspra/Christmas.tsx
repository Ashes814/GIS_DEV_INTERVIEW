import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gasp from "gasp";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
//import hdr loader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Water } from "three/examples/jsm/objects/Water2";

import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

const ThreeDemo = () => {
  const threeRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    // camera
    const camera = new THREE.PerspectiveCamera(
      75, // 视角,能捕捉到的范围
      window.innerWidth / window.innerHeight,
      0.1, // 近平面, 相机最近能看到的平面
      1000 // 远平面, 相机最远能看到的平面
    );
    camera.position.set(-3.23, 2.98, 4.06);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    scene.add(camera);
    // WebGL render
    const renderer = new THREE.WebGLRenderer({
      // 设置抗锯齿
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // add Dom
    threeRef.current.appendChild(renderer.domElement);

    // 设置色调映射
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.encoding = THREE.sRGBEncoding;

    // initializing control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // initializing loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // add env texture
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("./textures/sky.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      // texture.encoding = THREE.sRGBEncoding;
      scene.background = texture;
      scene.environment = texture;
    });
    // add model
    gltfLoader.load("./model/scene.glb", (gltf) => {
      const model = gltf.scene;
      // model.scale.set(0.1, 0.1, 0.1);
      model.traverse((child) => {
        if (child.name === "Plane") {
          child.visible = false;
        }
      });
      scene.add(model);
    });

    // create water surface
    const waterGeometry = new THREE.CircleGeometry(300, 32);
    const water = new Water(waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0xeeeeff,
      flowDirection: new THREE.Vector2(2, 1),
      scale: 100,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.4, 0);
    scene.add(water);

    // initializing light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 50, 0);
    scene.add(light);

    // add point light
    const pointLight = new THREE.PointLight(0xffffff, 1000);
    pointLight.position.set(0.5, 2.3, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      controls.update();
    }
    render();
  }, []);

  return (
    <>
      <div ref={threeRef}></div>
      {/* <button
        style={{ position: "absolute", zIndex: "999" }}
        onClick={btnClick}
      >
        点击全屏
      </button> */}
    </>
  );
};
export default ThreeDemo;
