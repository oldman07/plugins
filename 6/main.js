let scene, camera, renderer, loader, textureLoader, controls;
let models = [];
let currentModel = null;
let raycaster, mouse;
let firstModel = null;

function init() {
  // Create a scene
  scene = new THREE.Scene();
  
  // Create a camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Create a renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Add ambient light
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(0.5, 1, 1).normalize();
  scene.add(directionalLight);

  // Load HDRI environment map
  const rgbeLoader = new THREE.RGBELoader();
  rgbeLoader.setPath('environment/'); // Set the path to the HDRI file
  rgbeLoader.load('outdoor.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
    console.log("HDRI loaded successfully");
  }, undefined, function(error) {
    console.error('Error loading HDRI file:', error);
  });

  // Initialize loaders
  loader = new THREE.GLTFLoader();
  textureLoader = new THREE.TextureLoader();

  // Initialize controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  // Initialize raycaster and mouse
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Add event listeners for buttons
  document.getElementById('AddWindowFrame1').addEventListener('click', () => loadModel('models/windows1.glb', 'Window 1'));
  document.getElementById('AddWindowFrame2').addEventListener('click', () => loadModel('models/windows2.glb', 'Window 2'));
  document.getElementById('addModel3').addEventListener('click', () => loadModel('models/torus.glb', 'Torus'));
  document.getElementById('texture1').addEventListener('click', () => applyTexture('clay.jpg'));
  document.getElementById('texture2').addEventListener('click', () => applyTexture('rubber.jpg'));
  document.getElementById('applyPosition').addEventListener('click', applyPosition);
  document.getElementById('applyDimensions').addEventListener('click', applyDimensions);
  document.getElementById('parentAll').addEventListener('click', parentAllModels);

  // Add event listeners for mouse interaction
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('click', onClick, false);

  // Start rendering the scene
  animate();
}

function loadModel(modelPath, modelName) {
  loader.load(modelPath, function(gltf) {
    const model = gltf.scene;
    model.name = modelName; // Store model name for identification

    if (!firstModel) {
      // This is the first model
      firstModel = model;
      scene.add(firstModel);
    } else {
      // Add model to the scene (not parented yet)
      scene.add(model);
    }

    models.push(model); // Add to models list

    console.log(firstModel); // Debugging: Check the hierarchy

    // Disable buttons once a model is added
    document.getElementById('AddWindowFrame1').disabled = true;
    document.getElementById('AddWindowFrame2').disabled = true;
    document.getElementById('addModel3').disabled = firstModel ? false : true; // Enable/Disable based on firstModel
  }, undefined, function(error) {
    console.error(error);
  });
}

function applyTexture(texturePath) {
  if (currentModel) {
    textureLoader.load(texturePath, function(texture) {
      currentModel.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      });
    }, undefined, function(error) {
      console.error(error);
    });
  } else {
    console.log('No model selected to apply texture.');
  }
}

function applyPosition() {
  if (currentModel) {
    const x = parseFloat(document.getElementById('posX').value);
    const y = parseFloat(document.getElementById('posY').value);
    const z = parseFloat(document.getElementById('posZ').value);

    currentModel.position.set(x, y, z);
  } else {
    console.log('No model selected to apply position.');
  }
}

function applyDimensions() {
  if (currentModel) {
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);

    currentModel.scale.set(length, height, width);
  } else {
    console.log('No model selected to apply dimensions.');
  }
}

function parentAllModels() {
  if (firstModel && models.length > 1) {
    models.forEach((model, index) => {
      if (index !== 0) { // Skip the first model (it’s the parent already)
        firstModel.add(model);
        model.position.set(0, 0, 0); // Optional: Adjust the position if needed
      }
    });
    console.log('All models parented to the first model');
  } else {
    console.log('No models to parent or only one model loaded.');
  }
}

function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onClick(event) {
  event.preventDefault();

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(models, true);

  if (intersects.length > 0) {
    if (currentModel) {
      currentModel.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive.set(0x000000);
        }
      });
    }

    currentModel = intersects[0].object.parent;

    currentModel.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive.set(0x555555);
      }
    });

    updateControls();
  }
}

function updateControls() {
  if (currentModel) {
    document.getElementById('posX').value = currentModel.position.x.toFixed(1);
    document.getElementById('posY').value = currentModel.position.y.toFixed(1);
    document.getElementById('posZ').value = currentModel.position.z.toFixed(1);

    document.getElementById('length').value = currentModel.scale.x.toFixed(1);
    document.getElementById('width').value = currentModel.scale.z.toFixed(1);
    document.getElementById('height').value = currentModel.scale.y.toFixed(1);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

init();













// let scene, camera, renderer, loader, textureLoader, controls;
// let models = [];
// let currentModel = null;
// let raycaster, mouse;
// let firstModel = null;

// function init() {
//   // Create a scene
//   scene = new THREE.Scene();
  
//   // Create a camera
//   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//   camera.position.z = 5;
  
//   // Create a renderer
//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);
  
//   // Add ambient light
//   const light = new THREE.AmbientLight(0x404040);
//   scene.add(light);

//   // Add directional light
//   const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//   directionalLight.position.set(0.5, 1, 1).normalize();
//   scene.add(directionalLight);

//   // Load HDRI environment map
//   const rgbeLoader = new THREE.RGBELoader();
//   rgbeLoader.setPath('environment/'); // Set the path to the HDRI file
//   rgbeLoader.load('outdoor.hdr', function(texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = texture;
//     scene.background = texture;
//     console.log("HDRI loaded successfully");
//   }, undefined, function(error) {
//     console.error('Error loading HDRI file:', error);
//   });

//   // Initialize loaders
//   loader = new THREE.GLTFLoader();
//   textureLoader = new THREE.TextureLoader();

//   // Initialize controls
//   controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.25;
//   controls.enableZoom = true;

//   // Initialize raycaster and mouse
//   raycaster = new THREE.Raycaster();
//   mouse = new THREE.Vector2();

//   // Add event listeners for buttons
//   document.getElementById('AddWindowFrame1').addEventListener('click', () => loadModel('models/windows1.glb', 'Window 1'));
//   document.getElementById('AddWindowFrame2').addEventListener('click', () => loadModel('models/windows2.glb', 'Window 2'));
//   document.getElementById('addModel3').addEventListener('click', () => loadModel('models/torus.glb', 'Torus'));
//   document.getElementById('texture1').addEventListener('click', () => applyTexture('clay.jpg'));
//   document.getElementById('texture2').addEventListener('click', () => applyTexture('rubber.jpg'));
//   document.getElementById('applyPosition').addEventListener('click', applyPosition);
//   document.getElementById('applyDimensions').addEventListener('click', applyDimensions);
//   document.getElementById('parentAll').addEventListener('click', parentAllModels);

//   // Add event listeners for mouse interaction
//   window.addEventListener('mousemove', onMouseMove, false);
//   window.addEventListener('click', onClick, false);

//   // Start rendering the scene
//   animate();
// }

// function loadModel(modelPath, modelName) {
//   loader.load(modelPath, function(gltf) {
//     const model = gltf.scene;
//     model.name = modelName; // Store model name for identification

//     if (!firstModel) {
//       // This is the first model
//       firstModel = model;
//       scene.add(firstModel);
//     } else {
//       // Add model to the scene (not parented yet)
//       scene.add(model);
//     }

//     models.push(model); // Add to models list

//     console.log(firstModel); // Debugging: Check the hierarchy

//     // Disable buttons once a model is added
//     document.getElementById('AddWindowFrame1').disabled = true;
//     document.getElementById('AddWindowFrame2').disabled = true;
//     document.getElementById('addModel3').disabled = firstModel ? false : true; // Enable/Disable based on firstModel
//   }, undefined, function(error) {
//     console.error(error);
//   });
// }

// function applyTexture(texturePath) {
//   if (currentModel) {
//     textureLoader.load(texturePath, function(texture) {
//       currentModel.traverse((child) => {
//         if (child.isMesh) {
//           child.material.map = texture;
//           child.material.needsUpdate = true;
//         }
//       });
//     }, undefined, function(error) {
//       console.error(error);
//     });
//   } else {
//     console.log('No model selected to apply texture.');
//   }
// }

// function applyPosition() {
//   if (currentModel) {
//     const x = parseFloat(document.getElementById('posX').value);
//     const y = parseFloat(document.getElementById('posY').value);
//     const z = parseFloat(document.getElementById('posZ').value);

//     currentModel.position.set(x, y, z);
//   } else {
//     console.log('No model selected to apply position.');
//   }
// }

// function applyDimensions() {
//   if (currentModel) {
//     const length = parseFloat(document.getElementById('length').value);
//     const width = parseFloat(document.getElementById('width').value);
//     const height = parseFloat(document.getElementById('height').value);

//     currentModel.scale.set(length, height, width);
//   } else {
//     console.log('No model selected to apply dimensions.');
//   }
// }

// function parentAllModels() {
//   if (firstModel && models.length > 1) {
//     models.forEach((model, index) => {
//       if (index !== 0) { // Skip the first model (it’s the parent already)
//         firstModel.add(model);
//         model.position.set(0, 0, 0); // Optional: Adjust the position if needed
//       }
//     });
//     console.log('All models parented to the first model');
//   } else {
//     console.log('No models to parent or only one model loaded.');
//   }
// }

// function onMouseMove(event) {
//   event.preventDefault();

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
// }

// function onClick(event) {
//   event.preventDefault();

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(models, true);

//   if (intersects.length > 0) {
//     if (currentModel) {
//       currentModel.traverse((child) => {
//         if (child.isMesh) {
//           child.material.emissive.set(0x000000);
//         }
//       });
//     }

//     currentModel = intersects[0].object.parent;

//     currentModel.traverse((child) => {
//       if (child.isMesh) {
//         child.material.emissive.set(0x555555);
//       }
//     });

//     updateControls();
//   }
// }

// function updateControls() {
//   if (currentModel) {
//     document.getElementById('posX').value = currentModel.position.x.toFixed(1);
//     document.getElementById('posY').value = currentModel.position.y.toFixed(1);
//     document.getElementById('posZ').value = currentModel.position.z.toFixed(1);

//     document.getElementById('length').value = currentModel.scale.x.toFixed(1);
//     document.getElementById('width').value = currentModel.scale.z.toFixed(1);
//     document.getElementById('height').value = currentModel.scale.y.toFixed(1);
//   }
// }

// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   renderer.render(scene, camera);
// }

// init();










// let scene, camera, renderer, loader, textureLoader, controls;
// let models = [];
// let currentModel = null;
// let raycaster, mouse;
// let firstModel = null;

// function init() {
//   // Create a scene
//   scene = new THREE.Scene();
  
//   // Create a camera
//   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//   camera.position.z = 5;
  
//   // Create a renderer
//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);
  
//   // Add ambient light
//   const light = new THREE.AmbientLight(0x404040);
//   scene.add(light);

//   // Add directional light
//   const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//   directionalLight.position.set(0.5, 1, 1).normalize();
//   scene.add(directionalLight);

//   // Load HDRI environment map
//   const rgbeLoader = new THREE.RGBELoader();
//   rgbeLoader.setPath('environment/'); // Set the path to the HDRI file
//   rgbeLoader.load('outdoor.hdr', function(texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = texture;
//     scene.background = texture;
//     console.log("HDRI loaded successfully");
//   }, undefined, function(error) {
//     console.error('Error loading HDRI file:', error);
//   });

//   // Initialize loaders
//   loader = new THREE.GLTFLoader();
//   textureLoader = new THREE.TextureLoader();

//   // Initialize controls
//   controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.25;
//   controls.enableZoom = true;

//   // Initialize raycaster and mouse
//   raycaster = new THREE.Raycaster();
//   mouse = new THREE.Vector2();

//   // Add event listeners for buttons
//   document.getElementById('AddWindowFrame1').addEventListener('click', () => loadModel('models/windows1.glb', 'Window 1'));
//   document.getElementById('AddWindowFrame2').addEventListener('click', () => loadModel('models/windows2.glb', 'Window 2'));
//   document.getElementById('addModel3').addEventListener('click', () => loadModel('models/torus.glb', 'Torus'));
//   document.getElementById('texture1').addEventListener('click', () => applyTexture('clay.jpg'));
//   document.getElementById('texture2').addEventListener('click', () => applyTexture('rubber.jpg'));
//   document.getElementById('applyPosition').addEventListener('click', applyPosition);
//   document.getElementById('applyDimensions').addEventListener('click', applyDimensions);

//   // Add event listeners for mouse interaction
//   window.addEventListener('mousemove', onMouseMove, false);
//   window.addEventListener('click', onClick, false);

//   // Start rendering the scene
//   animate();
// }

// function loadModel(modelPath, modelName) {
//   loader.load(modelPath, function(gltf) {
//     const model = gltf.scene;
//     model.name = modelName; // Store model name for identification

//     if (!firstModel) {
//       // This is the first model
//       firstModel = model;
//       scene.add(firstModel);
//     } else if (modelName === 'Torus') {
//       // Make the Torus a child of the first model
//       firstModel.add(model);
//       model.position.set(0, 0, 0); // Optional: Adjust the position if needed
//       model.scale.set(1, 1, 1); // Optional: Adjust the scale if needed
//     } else {
//       // This is not the first model and not the Torus, make it a child of the first model
//       firstModel.add(model);
//     }

//     models.push(model); // Add to models list

//     console.log(firstModel); // Debugging: Check the hierarchy

//     // Disable buttons once a model is added
//     document.getElementById('AddWindowFrame1').disabled = true;
//     document.getElementById('AddWindowFrame2').disabled = true;
//     document.getElementById('addModel3').disabled = firstModel ? false : true; // Enable/Disable based on firstModel
//   }, undefined, function(error) {
//     console.error(error);
//   });
// }


// function applyTexture(texturePath) {
//   if (currentModel) {
//     textureLoader.load(texturePath, function(texture) {
//       currentModel.traverse((child) => {
//         if (child.isMesh) {
//           child.material.map = texture;
//           child.material.needsUpdate = true;
//         }
//       });
//     }, undefined, function(error) {
//       console.error(error);
//     });
//   } else {
//     console.log('No model selected to apply texture.');
//   }
// }

// function applyPosition() {
//   if (currentModel) {
//     const x = parseFloat(document.getElementById('posX').value);
//     const y = parseFloat(document.getElementById('posY').value);
//     const z = parseFloat(document.getElementById('posZ').value);

//     currentModel.position.set(x, y, z);
//   } else {
//     console.log('No model selected to apply position.');
//   }
// }

// function applyDimensions() {
//   if (currentModel) {
//     const length = parseFloat(document.getElementById('length').value);
//     const width = parseFloat(document.getElementById('width').value);
//     const height = parseFloat(document.getElementById('height').value);

//     currentModel.scale.set(length, height, width);
//   } else {
//     console.log('No model selected to apply dimensions.');
//   }
// }

// function onMouseMove(event) {
//   event.preventDefault();

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
// }

// function onClick(event) {
//   event.preventDefault();

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(models, true);

//   if (intersects.length > 0) {
//     if (currentModel) {
//       currentModel.traverse((child) => {
//         if (child.isMesh) {
//           child.material.emissive.set(0x000000);
//         }
//       });
//     }

//     currentModel = intersects[0].object.parent;

//     currentModel.traverse((child) => {
//       if (child.isMesh) {
//         child.material.emissive.set(0x555555);
//       }
//     });

//     updateControls();
//   }
// }

// function updateControls() {
//   if (currentModel) {
//     document.getElementById('posX').value = currentModel.position.x.toFixed(1);
//     document.getElementById('posY').value = currentModel.position.y.toFixed(1);
//     document.getElementById('posZ').value = currentModel.position.z.toFixed(1);

//     document.getElementById('length').value = currentModel.scale.x.toFixed(1);
//     document.getElementById('width').value = currentModel.scale.z.toFixed(1);
//     document.getElementById('height').value = currentModel.scale.y.toFixed(1);
//   }
// }

// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   renderer.render(scene, camera);
// }

// init();


























// let scene, camera, renderer, loader, textureLoader, controls;
// let models = [];
// let currentModel = null;
// let raycaster, mouse;

// function init() {
//   // Create a scene
//   scene = new THREE.Scene();
  
//   // Create a camera
//   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//   camera.position.z = 5;
  
//   // Create a renderer
//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);
  
//   // Add ambient light
//   const light = new THREE.AmbientLight(0x404040);
//   scene.add(light);

//   // Add directional light
//   const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//   directionalLight.position.set(0.5, 1, 1).normalize();
//   scene.add(directionalLight);

//   // Load HDRI environment map
//   const rgbeLoader = new THREE.RGBELoader();
//   rgbeLoader.setPath('environment/'); // Set the path to the HDRI file
//   rgbeLoader.load('outdoor.hdr', function(texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = texture;
//     scene.background = texture;
//     console.log("HDRI loaded successfully");
//   }, undefined, function(error) {
//     console.error('Error loading HDRI file:', error);
//   });

//   // Initialize loaders
//   loader = new THREE.GLTFLoader();
//   textureLoader = new THREE.TextureLoader();

//   // Initialize controls
//   controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.25;
//   controls.enableZoom = true;

//   // Initialize raycaster and mouse
//   raycaster = new THREE.Raycaster();
//   mouse = new THREE.Vector2();

//   // Disable the Model 3 button initially
//   document.getElementById('addModel3').disabled = true;

//   // Add event listeners for buttons
//   document.getElementById('AddWindowFrame1').addEventListener('click', () => loadModel('models/windows1.glb', 'Window 1'));
//   document.getElementById('AddWindowFrame2').addEventListener('click', () => loadModel('models/windows2.glb', 'Window 2'));
//   document.getElementById('addModel3').addEventListener('click', () => loadModel('models/torus.glb', 'Model 3'));
//   document.getElementById('texture1').addEventListener('click', () => applyTexture('clay.jpg'));
//   document.getElementById('texture2').addEventListener('click', () => applyTexture('rubber.jpg'));
//   document.getElementById('applyPosition').addEventListener('click', applyPosition);
//   document.getElementById('applyDimensions').addEventListener('click', applyDimensions);

//   // Add event listeners for mouse interaction
//   window.addEventListener('mousemove', onMouseMove, false);
//   window.addEventListener('click', onClick, false);

//   // Start rendering the scene
//   animate();
// }

// function loadModel(modelPath, modelName) {
//   loader.load(modelPath, function(gltf) {
//     const model = gltf.scene;
//     model.name = modelName; // Store model name for identification
//     models.push(model); // Add to models list
//     scene.add(model);

//     // Disable Window 1 and 2 buttons once a model is added
//     document.getElementById('AddWindowFrame1').disabled = true;
//     document.getElementById('AddWindowFrame2').disabled = true;

//     // Enable the Model 3 button after Window 1 or 2 is added
//     if (modelName === 'Window 1' || modelName === 'Window 2') {
//       document.getElementById('addModel3').disabled = false;
//     }
//   }, undefined, function(error) {
//     console.error(error);
//   });
// }

// function applyTexture(texturePath) {
//   if (currentModel) {
//     textureLoader.load(texturePath, function(texture) {
//       currentModel.traverse((child) => {
//         if (child.isMesh) {
//           child.material.map = texture;
//           child.material.needsUpdate = true;
//         }
//       });
//     }, undefined, function(error) {
//       console.error(error);
//     });
//   } else {
//     console.log('No model selected to apply texture.');
//   }
// }

// function applyPosition() {
//   if (currentModel) {
//     const x = parseFloat(document.getElementById('posX').value);
//     const y = parseFloat(document.getElementById('posY').value);
//     const z = parseFloat(document.getElementById('posZ').value);

//     currentModel.position.set(x, y, z);
//   } else {
//     console.log('No model selected to apply position.');
//   }
// }

// function applyDimensions() {
//   if (currentModel) {
//     const length = parseFloat(document.getElementById('length').value);
//     const width = parseFloat(document.getElementById('width').value);
//     const height = parseFloat(document.getElementById('height').value);

//     currentModel.scale.set(length, height, width);
//   } else {
//     console.log('No model selected to apply dimensions.');
//   }
// }

// function onMouseMove(event) {
//   event.preventDefault();

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
// }

// function onClick(event) {
//   event.preventDefault();

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(models, true);

//   if (intersects.length > 0) {
//     if (currentModel) {
//       currentModel.traverse((child) => {
//         if (child.isMesh) {
//           child.material.emissive.set(0x000000);
//         }
//       });
//     }

//     currentModel = intersects[0].object.parent;

//     currentModel.traverse((child) => {
//       if (child.isMesh) {
//         child.material.emissive.set(0x555555);
//       }
//     });

//     updateControls();
//   }
// }

// function updateControls() {
//   if (currentModel) {
//     document.getElementById('posX').value = currentModel.position.x.toFixed(1);
//     document.getElementById('posY').value = currentModel.position.y.toFixed(1);
//     document.getElementById('posZ').value = currentModel.position.z.toFixed(1);

//     document.getElementById('length').value = currentModel.scale.x.toFixed(1);
//     document.getElementById('width').value = currentModel.scale.z.toFixed(1);
//     document.getElementById('height').value = currentModel.scale.y.toFixed(1);
//   }
// }

// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   renderer.render(scene, camera);
// }

// init();


