import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
//import hdr loader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

const ThreeDemo = () => {
  const threeRef = useRef(null);
  //   const [r, setR] = useState(null);
  //   let btnClick = () => {
  //     r.domElement.requestFullscreen();
  //   };
  useEffect(() => {
    // basic Code
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // 视角,能捕捉到的范围
      window.innerWidth / window.innerHeight,
      0.1, // 近平面, 相机最近能看到的平面
      1000 // 远平面, 相机最远能看到的平面
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeRef.current.appendChild(renderer.domElement);
    camera.position.z = 10;
    camera.lookAt(1, 2, 0);
    const axesHelper = new THREE.AxesHelper();
    axesHelper.scale.set(10, 10, 10);
    scene.add(axesHelper);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    function animate() {
      controls.update();
      requestAnimationFrame(animate);
      //   cube.rotation.x += 0.01;
      //   cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      TWEEN.update();
    }
    animate();
    const gui = new GUI();

    //光照与阴影
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const material = new THREE.MeshStandardMaterial({});
    const sphere = new THREE.Mesh(sphereGeometry, material);

    // 物体也要投射阴影
    sphere.castShadow = true;
    scene.add(sphere);

    // 创建平面
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    // 接收阴影
    plane.receiveShadow = true;
    scene.add(plane);

    // 灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    // 直线光源
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // directionalLight.position.set(10, 10, 10);
    // // // 设置投射阴影
    // directionalLight.castShadow = true;
    // scene.add(directionalLight);

    // 聚光灯
    const spotLight = new THREE.SpotLight(0xffffff, 500);
    spotLight.position.set(10, 10, 10);
    spotLight.castShadow = true;
    spotLight.target = sphere;
    // 设置聚光灯角度
    spotLight.angle = Math.PI / 6;

    spotLight.shadow.mapSize.set(2048, 2048);
    scene.add(spotLight);
    // 设置阴影贴图模糊度
    // directionalLight.shadow.radius = 20;
    // 设置阴影贴图分辨率
    // directionalLight.shadow.mapSize.set(2048, 2048);

    // 设置平行光投射相机的属性
    // directionalLight.shadow.camera.near = 0.5;
    // directionalLight.shadow.camera.far = 500;
    // directionalLight.shadow.camera.top = 5;
    // directionalLight.shadow.camera.bottom = -5;
    // directionalLight.shadow.camera.left = -5;
    // directionalLight.shadow.camera.right = 5;
    // gui
    //   .add(directionalLight.shadow.camera, "near")
    //   .min(0)
    //   .max(20)
    //   .step(0.1)
    //   .onChange(() => directionalLight.shadow.camera.updateProjectionMatrix());
    // // 开启渲染器的阴影贴图
    renderer.shadowMap.enabled = true;

    // create 3 Balls
    // const sphere1 = new THREE.Mesh(
    //   new THREE.SphereGeometry(1, 32, 32),
    //   new THREE.MeshBasicMaterial({
    //     color: 0x0000ff,
    //   })
    // );
    // sphere1.position.x = -3;
    // const sphere2 = new THREE.Mesh(
    //   new THREE.SphereGeometry(1, 32, 32),
    //   new THREE.MeshBasicMaterial({
    //     color: 0xff00ff,
    //   })
    // );
    // sphere2.position.x = 0;
    // const sphere3 = new THREE.Mesh(
    //   new THREE.SphereGeometry(1, 32, 32),
    //   new THREE.MeshBasicMaterial({
    //     color: 0x00ffff,
    //   })
    // );
    // sphere3.position.x = 3;
    // scene.add(sphere1);
    // const tween = new TWEEN.Tween(sphere1.position);
    // tween.to({ x: 10 }, 2000);
    // // tween.repeat(Infinity);
    // // tween.yoyo(true); // 悠悠球,循环运动
    // // 设置ease
    // tween.easing(TWEEN.Easing.Quadratic.InOut);
    // // tween.delay(500);

    // // 设置第二个动画
    // const tween2 = new TWEEN.Tween(sphere1.position);
    // tween2.to({ x: 0 }, 1000);
    // tween.chain(tween2);
    // tween2.chain(tween);
    // tween.start();
    // scene.add(sphere2);
    // scene.add(sphere3);

    // // 创建射线
    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2();

    // window.addEventListener("click", (event) => {
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //   // 通过摄像机和鼠标位置更新射线
    //   raycaster.setFromCamera(mouse, camera);
    //   // 计算物体和射线的焦点
    //   const intersects = raycaster.intersectObjects([
    //     sphere1,
    //     sphere2,
    //     sphere3,
    //   ]);
    //   if (intersects.length > 0) {
    //     if (intersects[0].object._isSelect) {
    //       intersects[0].object.material.color.set(
    //         intersects[0].object._originColor
    //       );
    //       intersects[0].object._isSelect = false;
    //       return;
    //     }
    //     intersects[0].object._originColor =
    //       intersects[0].object.material.color.getHex();
    //     intersects[0].object.material.color.set(0xff0000);
    //     intersects[0].object._isSelect = true;
    //   }
    // });

    // 实例化加载器 gltf
    // const gltfLoader = new GLTFLoader();
    // gltfLoader.load("./model/Duck.glb", (gltf) => {
    //   console.log(gltf);
    //   scene.add(gltf.scene);
    // });

    // // 加载被压缩的gltf
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath("./draco/");
    // gltfLoader.setDRACOLoader(dracoLoader);

    // gltfLoader.load("./model/city.glb", (gltf) => {
    //   console.log(gltf);
    //   scene.add(gltf.scene);
    // });
    // add env map

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // texture loader
    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load(
    //   "./texture/watercover/CityNewYork002_COL_VAR1_1K.png"
    // );
    // set colorspace to RGB so that our eyes can have better feeling
    // texture.colorSpace = THREE.SRGBColorSpace;
    // AO texture
    // const aoMap = textureLoader.load(
    //   "./texture/watercover/CityNewYork002_AO_1K.jpg"
    // );
    // // transparent texture
    // const alphaMap = textureLoader.load("./texture/door/height.jpg");
    // // light texture
    // const lightMap = textureLoader.load("./texture/colors.png");
    // // specular texture
    // const specularMap = textureLoader.load(
    //   "./texture/watercover/CityNewYork002_GLOSS_1K.jpg"
    // );
    // // rgbeLoader to add hdr texture
    // const rgbeLoader = new RGBELoader();
    // rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
    //   // 为了使得hdr为立体背景而不是平面背景,需要设置球形贴图
    //   envMap.mapping = THREE.EquirectangularReflectionMapping;
    //   // set background
    //   //   scene.background = envMap;
    //   scene.environment = envMap;
    //   //   planeMaterial.envMap = envMap;
    // });
    // initial plane
    // const planeGeometry = new THREE.PlaneGeometry(1, 1);
    // const planeMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xffffff,
    //   map: texture,
    //   // allow transparent
    //   transparent: true,
    //   // set ao
    //   aoMap: aoMap,
    //   // set alpha
    //   //   alphaMap: alphaMap,
    //   //set light map
    //   //   lightMap,
    //   //   reflectivity: 0.1,
    //   specularMap,
    // });
    // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // scene.add(plane);
    // 创建顶点数据
    // const vertices = new Float32Array([
    //   -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
    // ]);
    // 设置顶点位置属性
    // geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    // 创建索引
    // const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
    // geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // 设置两个顶点组,形成两个材质
    // geometry.addGroup(0, 3, 0);
    // geometry.addGroup(3, 3, 1);
    // const material1 = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00,
    //   side: THREE.DoubleSide,
    //   wireframe: true,
    // });
    // const material2 = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   side: THREE.DoubleSide,
    //   wireframe: false,
    // });
    // const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // parentMaterial.wireframe = true; // set parent material to wireframe
    // create grid
    // let parentCube = new THREE.Mesh(geometry, parentMaterial);
    // const plane = new THREE.Mesh(geometry, [material1, material2]);
    // parentCube.add(cube);
    // parentCube.position.set(-3, 0, 0);
    // parentCube.rotation.x = Math.PI / 4;
    // cube.position.x = 3;
    // cube.scale.set(0.4, 0.4, 0.4);
    // parentCube.scale.set(1, 1, 1);
    // console.log(geometry);
    // 绕着x轴旋转
    // cube.rotation.x = Math.PI / 4;
    // setR(renderer);
    // let eventObj = {
    //   Fullscreen: function () {
    //     document.body.requestFullscreen();
    //     console.log("fs");
    //   },
    //   ExitFullscreen: function () {
    //     document.exitFullscreen();
    //     console.log("ex");
    //   },
    // };

    // 创建长方体
    // const boxGeometry = new THREE.BoxGeometry(1, 1, 100);
    // const boxMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00,
    // });
    // const box = new THREE.Mesh(boxGeometry, boxMaterial);
    // scene.add(box);

    // // create scene fog
    // // scene.fog = new THREE.Fog(0xdddddd, 0.1, 50);
    // // exponent fog
    // scene.fog = new THREE.FogExp2(0x999999, 0.1);
    // scene.background = new THREE.Color(0x999999);

    // gui.add(eventObj, "Fullscreen");
    // gui.add(eventObj, "ExitFullscreen");
    // gui
    //   .add(planeMaterial, "aoMapIntensity")
    //   .min(0)
    //   .max(1)
    //   .name("环境光遮蔽贴图");
    // gui
    //   .add(texture, "colorSpace", {
    //     sRGB: THREE.SRGBColorSpace,
    //     Linear: THREE.LinearSRGBColorSpace,
    //   })
    //   .onChange(() => {
    //     texture.needsUpdate = true;
    //   });
    //控制立方体位置
    // let folder = gui.addFolder("立方体位置");
    // folder.add(plane.position, "x", -10, 10);
    // folder
    //   .add(plane.position, "y")
    //   .min(-10)
    //   .max(10)
    //   .step(2)
    //   .name("立方体y轴位置");
    // // gui.add(plane, "wireframe");
    // let colorParams = {
    //   cubeColor: "#00ff00",
    // };
    // gui.addColor(colorParams, "cubeColor").onChange((val) => {
    //   plane.material.color.set(val);
    // });

    window.addEventListener("resize", () => {
      // 重置渲染器宽高比
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 重置相机宽高比
      camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      camera.updateProjectionMatrix();
    });
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
