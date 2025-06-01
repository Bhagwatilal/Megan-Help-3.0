
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface SceneProps {
  className?: string;
}

const Scene: React.FC<SceneProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    
    // Create shapes
    const shapes: THREE.Mesh[] = [];
    const colors = [
      new THREE.Color(0x0d87de), // mentii-500
      new THREE.Color(0x8662f0), // lavender-500
      new THREE.Color(0x22b864), // mint-500
      new THREE.Color(0xf57219), // sunset-500
    ];
    
    // Create blobs (spheres with displacement)
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 0.3 + 0.2, 32, 32);
      
      // Create a custom shader material with displacement
      const material = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.7,
        shininess: 50,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.x = (Math.random() - 0.5) * 6;
      mesh.position.y = (Math.random() - 0.5) * 6;
      mesh.position.z = (Math.random() - 0.5) * 3;
      
      // Store initial position for animation
      (mesh as any).initialPosition = {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
      };
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      // Random animation speeds
      (mesh as any).rotationSpeed = {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
      };
      
      (mesh as any).floatSpeed = Math.random() * 0.005 + 0.001;
      (mesh as any).floatOffset = Math.random() * Math.PI * 2;
      
      scene.add(mesh);
      shapes.push(mesh);
    }
    
    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update shapes
      const time = Date.now() * 0.001;
      
      shapes.forEach((shape) => {
        // Gentle floating animation
        shape.position.y = 
          (shape as any).initialPosition.y + 
          Math.sin(time * (shape as any).floatSpeed + (shape as any).floatOffset) * 0.3;
        
        // Subtle rotation
        shape.rotation.x += (shape as any).rotationSpeed.x;
        shape.rotation.y += (shape as any).rotationSpeed.y;
        
        // Subtle follow mouse
        shape.position.x += 
          (mousePosition.current.x * 0.1 + (shape as any).initialPosition.x - shape.position.x) * 0.02;
        shape.position.z += 
          (mousePosition.current.y * 0.1 + (shape as any).initialPosition.z - shape.position.z) * 0.02;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = 
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return <div ref={containerRef} className={`${className || ""}`} />;
};

export default Scene;
