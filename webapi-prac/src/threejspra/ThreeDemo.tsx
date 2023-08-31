import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeDemo = () => {
  const threeRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // 视角,能捕捉到的范围
      window.innerWidth / window.innerHeight,
      0.1, // 近平面, 相机最近能看到的平面
      1000 // 远平面, 相机最远能看到的平面
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    threeRef.current.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  }, []);

  return <div ref={threeRef}></div>;
};
export default ThreeDemo;
