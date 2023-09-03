import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
//import hdr loader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const ThreeDemo = () => {
  const threeRef = useRef(null);
  //   const [r, setR] = useState(null);
  //   let btnClick = () => {
  //     r.domElement.requestFullscreen();
  //   };
  useEffect(() => {
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
    // const geometry = new THREE.BoxGeometry(1, 1, 1);

    // texture loader
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "./texture/watercover/CityNewYork002_COL_VAR1_1K.png"
    );

    // AO texture
    const aoMap = textureLoader.load(
      "./texture/watercover/CityNewYork002_AO_1K.jpg"
    );

    // transparent texture
    const alphaMap = textureLoader.load("./texture/door/height.jpg");

    // light texture
    const lightMap = textureLoader.load("./texture/colors.png");

    // specular texture
    const specularMap = textureLoader.load(
      "./texture/watercover/CityNewYork002_GLOSS_1K.jpg"
    );

    // rgbeLoader to add hdr texture
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
      // 为了使得hdr为立体背景而不是平面背景,需要设置球形贴图
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      // set background
      scene.background = envMap;
      scene.environment = envMap;
      planeMaterial.envMap = envMap;
    });

    // initial plane
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,

      // allow transparent
      transparent: true,
      // set ao
      aoMap: aoMap,
      // set alpha
      //   alphaMap: alphaMap,
      //set light map
      //   lightMap,
      //   reflectivity: 0.1,
      specularMap,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

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

    camera.position.z = 2;
    camera.lookAt(1, 2, 0);

    // add Axes
    const axesHelper = new THREE.AxesHelper();
    axesHelper.scale.set(10, 10, 10);
    scene.add(axesHelper);

    // add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    function animate() {
      controls.update();
      requestAnimationFrame(animate);
      //   cube.rotation.x += 0.01;
      //   cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
    // setR(renderer);

    let eventObj = {
      Fullscreen: function () {
        document.body.requestFullscreen();
        console.log("fs");
      },
      ExitFullscreen: function () {
        document.exitFullscreen();
        console.log("ex");
      },
    };

    const gui = new GUI();
    gui.add(eventObj, "Fullscreen");
    gui.add(eventObj, "ExitFullscreen");
    gui
      .add(planeMaterial, "aoMapIntensity")
      .min(0)
      .max(1)
      .name("环境光遮蔽贴图");

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
