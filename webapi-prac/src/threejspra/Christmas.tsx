import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
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
  const scenesText = useRef(null);

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
      physicallyCorrectLights: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
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
      // 遍历model中的所有元素
      model.traverse((child) => {
        if (child.name === "Plane") {
          child.visible = false;
        }
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
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
    pointLight.position.set(0.1, 2.4, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // 创建点光源组
    const pointLightGroup = new THREE.Group();
    pointLightGroup.position.set(-8, 2.5, -1.5);
    const radius = 3;
    const pointLightArr = [];
    for (let i = 0; i < 3; i++) {
      // 创建球体当灯泡
      const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 100,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      pointLightArr.push(sphere);
      sphere.position.set(
        radius * Math.cos((i * 2 * Math.PI) / 3),
        Math.cos((i * 2 * Math.PI) / 3),
        radius * Math.sin((i * 2 * Math.PI) / 3)
      );

      const pointLight = new THREE.PointLight(0xffffff, 50);
      sphere.add(pointLight);
      pointLightGroup.add(sphere);
    }
    scene.add(pointLightGroup);

    // 使用补间函数,从0到2PI,使灯泡旋转
    const options = {
      angle: 0,
    };
    gsap.to(options, {
      angle: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: "linear",
      onUpdate: () => {
        pointLightGroup.rotation.y = options.angle;
        pointLightArr.forEach((item, index) => {
          item.position.set(
            radius * Math.cos((index * 2 * Math.PI) / 3),
            Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5),
            radius * Math.sin((index * 2 * Math.PI) / 3)
          );
        });
      },
    });

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      controls.update();
    }
    render();

    // 使用补间动画移动相机
    const timeLine1 = gsap.timeline();
    const timeLine2 = gsap.timeline();

    // 移动相机函数
    function translateCamera(position, target) {
      timeLine1.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 1,
        ease: "power2.inOut",
      });

      timeLine2.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1,
        ease: "power2.inOut",
      });
    }

    const scenes = [
      {
        text: "我是你爹",
        callback: () => {
          // 执行函数切换位置
          translateCamera(
            new THREE.Vector3(-3.23, 3, 4.06),
            new THREE.Vector3(-8, 2, 0)
          );
          restoreHeart();
        },
      },
      {
        text: "电死你",
        callback: () => {
          // 执行函数切换位置
          translateCamera(
            new THREE.Vector3(7, 0, 23),
            new THREE.Vector3(0, 0, 0)
          );
        },
      },
      {
        text: "马宁马宁, 请你吃饭",
        callback: () => {
          // 执行函数切换位置
          translateCamera(
            new THREE.Vector3(10, 3, 0),
            new THREE.Vector3(5, 2, 0)
          );
        },
      },
      {
        text: "今晚我要飞向月球",
        callback: () => {
          // 执行函数切换位置
          translateCamera(
            new THREE.Vector3(7, 0, 23),
            new THREE.Vector3(0, 0, 0)
          );
          makeHeart();
        },
      },
      {
        text: "霹雳啪哪古娜拉黑暗之神,起飞",
        callback: () => {
          // 执行函数切换位置
          translateCamera(
            new THREE.Vector3(-20, 1.3, 6.6),
            new THREE.Vector3(5, 2, 0)
          );
        },
      },
    ];

    let index = 0;

    // 监听鼠标滚轮事件
    window.addEventListener(
      "click",
      (e) => {
        if (index > scenes.length - 1) {
          index = 0;
        }
        scenes[index].callback();
        console.log(scenes[index].text);
        scenesText.current.innerHTML = `<div className="item"><p>${scenes[index].text}</p></div>`;
        index++;
      },
      false
    );

    // 实例化满天星星
    let starsInstance = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10,
      }),
      100
    );
    const startArr = [];
    const endArr = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100 - 50;
      const y = Math.random() * 100 - 50;
      const z = Math.random() * 100 - 50;
      startArr.push(new THREE.Vector3(x, y, z));
      const matrix = new THREE.Matrix4();
      matrix.setPosition(x, y, z);
      starsInstance.setMatrixAt(i, matrix);
    }
    scene.add(starsInstance);
    // 创建爱心路径
    const heartShape = new THREE.Shape();
    heartShape.moveTo(25, 25);
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);
    // 根据爱心路径获取点
    const center = new THREE.Vector3(0, 2, 10);
    for (let i = 0; i < 100; i++) {
      let point = heartShape.getPoint(i / 100);
      endArr.push(
        new THREE.Vector3(
          point.x * 0.1 + center.x,
          point.y * 0.1 + center.y,
          center.z
        )
      );
    }
    // 创建爱心动画
    function makeHeart() {
      const params = {
        time: 0,
      };
      gsap.to(params, {
        time: 1,
        duration: 1,
        onUpdate: () => {
          for (let i = 0; i < 100; i++) {
            const x =
              startArr[i].x + (endArr[i].x - startArr[i].x) * params.time;
            const y =
              startArr[i].y + (endArr[i].y - startArr[i].y) * params.time;
            const z =
              startArr[i].z + (endArr[i].z - startArr[i].z) * params.time;
            const matrix = new THREE.Matrix4();
            matrix.setPosition(x, y, z);
            starsInstance.setMatrixAt(i, matrix);
          }
          starsInstance.instanceMatrix.needsUpdate = true;
        },
      });
    }
    function restoreHeart() {
      const params = {
        time: 0,
      };
      gsap.to(params, {
        time: 1,
        duration: 1,
        onUpdate: () => {
          for (let i = 0; i < 100; i++) {
            const x = endArr[i].x + (startArr[i].x - endArr[i].x) * params.time;
            const y = endArr[i].y + (startArr[i].y - endArr[i].y) * params.time;
            const z = endArr[i].z + (startArr[i].z - endArr[i].z) * params.time;
            const matrix = new THREE.Matrix4();
            matrix.setPosition(x, y, z);
            starsInstance.setMatrixAt(i, matrix);
          }
          starsInstance.instanceMatrix.needsUpdate = true;
        },
      });
    }
  }, []);

  return (
    <>
      <div ref={threeRef}></div>
      <div ref={scenesText} className="text"></div>
    </>
  );
};
export default ThreeDemo;
