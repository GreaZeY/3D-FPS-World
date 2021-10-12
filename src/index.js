const {
  enable3d,
  Scene3D,
  Canvas,
  PhysicsLoader,
  AmmoPhysics,
  ThirdDimension,
  ExtendedObject3D,
  FirstPersonControls,
  THREE,
} = ENABLE3D;
//              Defining SFX variables
const fire = new Audio("/assets/SFX/nfire.mp3");
// fire.currentTime = 2;

fire.vlolume = 2;

class MainScene extends Scene3D {
  constructor() {
    super({ key: "MainScene" });
    this.move = { x: 0, y: 0, z: 0 };
  }
  async preload() {
   
  }
  init() {
    this.canJump = true;
    this.isJumping = false;
    // this.playerMove = false

    this.moveTop = 0;
    this.moveRight = 0;
  }

  async create() {
    this.accessThirdDimension();
    const { lights } = await this.third.warpSpeed("-ground", "-orbitControls");
    const { hemisphereLight, ambientLight, directionalLight } = lights;
    const intensity = 0.5;
    hemisphereLight.intensity = intensity;
    ambientLight.intensity = intensity;
    directionalLight.intensity = intensity;
    this.light = lights.directionalLight
    const d = 200
    this.light.shadow.camera.top = d
    this.light.shadow.camera.bottom = -d
    this.light.shadow.camera.left = -d
    this.light.shadow.camera.right = d
    this.light.shadow.mapSize.set(1000, 1000)
    this.light.shadow.camera.near = 200
    this.light.shadow.camera.far = 240
    this.light.shadow.bias = -0.01
    // debug shadow
    // physics debug
    // this.third.physics.debug?.enable();
    this.third.renderer.gammaFactor = 1.5;
    this.third.haveSomeFun(100)
    // set a per scene physics
    this.third.physics.setGravity(0, -9.81, 0);
    //add grass
    
    const grass = await this.third.load.texture(
      "/assets/grass/planegreen.jpg"
    );
    grass.wrapS = grass.wrapT = 1; // RepeatWrapping
    grass.offset.set(0, 0);
    // grass.repeat.set(50, 50);
    const ground = this.third.physics.add.ground(
      { width: 400, height: 400, y: 0 },
      { lambert: { map: grass, transparent: true } }
    );
    ground.body.setFriction(1)


///////////////////////////////// loading models
    this.third.load.gltf("/assets/glb/M4A12.glb").then((object) => {
      const rifle = object.scene;
      console.log("rifle", object);

      this.rifle = new ExtendedObject3D();
      // this.rifle.name = "M4A1-Nightmare";
      this.rifle.add(rifle);
      this.third.add.existing(this.rifle);
     
      this.rifle.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = child.receiveShadow = true;
          if (child.material) child.material.metalness = -2;
        }
      });
    });

    ///////////////////////////////////////////////////
    this.addmodel('OpenBarn',{x:0,y:0,z:20},{x:0.02,y:0.02,z:0.02},this.barn)
   
///////////////////////////////////////////////////////////////////////////////
    // add red dot
    this.redDot = this.add.circle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      3,
      0xff0000
    );
    this.redDot.depth = 1;

    // add player
    this.player = new ExtendedObject3D();
    this.player.position.set(0, 1.4, 0);
    this.third.physics.add.existing(this.player, {
      shape: "sphere",
      radius: 0.5,
      width: 0.5,
      offset: { y: 1 },
    });
    this.player.body.setFriction(1.2);
    this.player.body.setAngularFactor(0, 0, 0);

    // add first person controls
    this.firstPersonControls = new FirstPersonControls(
      this.third.camera,
      this.player,
      {}
      
    );

    // lock the pointer and update the first person control
    this.input.on("pointerdown", () => {
      this.input.mouse.requestPointerLock();
    });
    this.input.on("pointermove", (pointer) => {
      if (this.input.mouse.locked) {
        this.firstPersonControls.update(pointer.movementX, pointer.movementY);
      }
    });
    this.events.on("update", () => {
      this.firstPersonControls.update(0, 0);
    });

    // add keys
    this.keys = {
      w: this.input.keyboard.addKey("w"),
      a: this.input.keyboard.addKey("a"),
      s: this.input.keyboard.addKey("s"),
      d: this.input.keyboard.addKey("d"),
      q: this.input.keyboard.addKey("q"),
      e: this.input.keyboard.addKey("e"),
      space: this.input.keyboard.addKey(32),
      o: this.input.keyboard.addKey("o"),
      p: this.input.keyboard.addKey("p")
    };
  }

       
  addmodel(name,pos,scaling,cvar){
    this.third.load.fbx(`/assets/fbx/${name}.fbx`).then(object => {
      cvar = object
      this.cvar = new ExtendedObject3D()
      this.third.add.existing(cvar);
    cvar.position.set(pos.x,pos.y,pos.z)
    cvar.scale.set(scaling.x,scaling.y,scaling.z)
    cvar.rotation.set(0, Math.PI, 0)
    this.third.physics.add.existing(cvar,{
      shape: 'concave',
      mass: 100000,
      collisionFlags: 0,
      autoCenter: false,
      
    })
    cvar.traverse((child) => {
      if (child.isMesh) {
        // console.log('child',child.material)
        child.castShadow = child.receiveShadow = true;
        if (child.material) child.material.metalness = 0, child.material.roughness = 1;
      }
    });
  })
}

  
  jump() {
    if (!this.player) return;
    this.canJump = false;
    this.isJumping = true;
    this.time.addEvent({
      delay: 750,
      callback: () => (this.canJump = true),
    });
    this.time.addEvent({
      delay: 750,
      callback: () => {
        this.isJumping = false;
      },
    });
    this.player.body.applyForceY(4);
  }

  update(time, delta) {
    if (this.rifle) {
      // some variables
      const zoom = this.input.mousePointer.rightButtonDown();
      let speed = 4;
      let playerSpeed = 4;
      const direction = new THREE.Vector3();
      const rotation = this.third.camera.getWorldDirection(direction);
      const theta = Math.atan2(rotation.x, rotation.z);

      // reset red dot
      this.redDot.alpha = 1;

      // the rifle movement
      if (zoom) {
        this.redDot.alpha = 0;
        this.move.x = THREE.MathUtils.lerp(this.move.x, 0.6, 0.2);
        this.move.y = THREE.MathUtils.lerp(this.move.y, -0.8 + 1.8, 0.2);
        this.move.z = THREE.MathUtils.lerp(this.move.z, -0.45, 0.2);
      } else if (this.keys.w.isDown) {
        this.move.x = Math.sin(time * -0.015) * 0.075;
        this.move.y = Math.sin(time * 0.015) * 0.075;
        this.move.z = Math.sin(time * 0.015) * 0.075;
      } else {
        this.move.x = Math.sin(time * -0.003) * 0.01;
        this.move.y = Math.sin(time * 0.003) * 0.01;
        this.move.z = Math.sin(time * 0.003) * 0.01;
      }

      // tilt

      if (this.keys.q.isDown) {
        this.third.camera.rotateZ(0.2);
        this.firstPersonControls.offset = new THREE.Vector3(
          Math.sin(theta + Math.PI * 0.5) * 0.4,
          0,
          Math.cos(theta + Math.PI * 0.5) * 0.4
        );
      } else if (this.keys.e.isDown) {
        this.third.camera.rotateZ(-0.2);
        this.firstPersonControls.offset = new THREE.Vector3(
          Math.sin(theta - Math.PI * 0.5) * 0.4,
          0,
          Math.cos(theta - Math.PI * 0.5) * 0.4
        );
      } else {
        this.third.camera.rotateZ(0);
        this.firstPersonControls.offset = new THREE.Vector3(0, 0, 0);
      }

      // adjust the position of the rifle to the camera
      const raycaster = new THREE.Raycaster();
      // x and y are normalized device coordinates from -1 to +1
      raycaster.setFromCamera(
        { x: 0.6 - this.move.x, y: -0.8 - this.move.y },
        this.third.camera
      );
      const pos = new THREE.Vector3();

      pos.copy(raycaster.ray.direction);
      pos.multiplyScalar(0.8 + this.move.z);
      pos.add(raycaster.ray.origin);

      this.rifle.position.copy(pos);
      this.rifle.rotation.copy(this.third.camera.rotation);

      if (this.keys.o.isDown) {
        
        speed = speed+10
        playerSpeed = playerSpeed+10
        console.log('speed is',speed)
      }
      if (this.keys.p.isDown) {
        
        speed = speed-10
        playerSpeed = playerSpeed-10
        console.log('speed is',speed)
      }
    


      // move forwards and backwards
      if (this.keys.w.isDown) {
     
        // moving Camera
        this.player.position.x += Math.sin(theta) * speed;
        this.player.position.z += Math.cos(theta) * speed;
        // moving player body
        const x = Math.sin(theta) * playerSpeed,
          y = this.player.body.velocity.y,
          z = Math.cos(theta) * playerSpeed;
        this.player.body.setVelocity(x, y, z);
      } else if (this.keys.s.isDown) {
        this.player.position.x -= Math.sin(theta) * speed;
        this.player.position.z -= Math.cos(theta) * speed;
        const x = Math.sin(theta) * playerSpeed,
          y = this.player.body.velocity.y,
          z = Math.cos(theta) * playerSpeed;
        this.player.body.setVelocity(-x, y, -z);
      }

      // move sideways
      if (this.keys.a.isDown) {
        this.player.position.x += Math.sin(theta + Math.PI * 0.5) * speed;
        this.player.position.z += Math.cos(theta + Math.PI * 0.5) * speed;
        const x = Math.sin(theta + Math.PI * 0.5) * playerSpeed,
          y = this.player.body.velocity.y,
          z = Math.cos(theta + Math.PI * 0.5) * playerSpeed;
        this.player.body.setVelocity(x, y, z);
      } else if (this.keys.d.isDown) {
        this.player.position.x += Math.sin(theta - Math.PI * 0.5) * speed;
        this.player.position.z += Math.cos(theta - Math.PI * 0.5) * speed;
        const x = Math.sin(theta + Math.PI * 0.5) * playerSpeed,
          y = this.player.body.velocity.y,
          z = Math.cos(theta + Math.PI * 0.5) * playerSpeed;
        this.player.body.setVelocity(-x, y, -z);
      }

      //player jump
      if (this.keys.space.isDown && this.canJump) {
        this.jump();
      }

      // shoot
      if (this.input.mousePointer.leftButtonDown()) {
        fire.playbackRate = 3;
        fire.play();

        const x = 0;
        const y = 0;
        const force = 5;
        const pos = new THREE.Vector3();

        raycaster.setFromCamera({ x, y }, this.third.camera);

        pos.copy(raycaster.ray.direction);
        pos.add(raycaster.ray.origin);

        const sphere = this.third.physics.add.sphere(
          {
            radius: 0.05,
            x: pos.x,
            y: pos.y,
            z: pos.z,
            mass: 5,
            bufferGeometry: true,
          },
          // { phong: { color: 0xffffff00 }},
          { lambert: { color: "white", transparent: true, opacity: 1 } }
        );

        pos.copy(raycaster.ray.direction);
        pos.multiplyScalar(24);

        sphere.body.applyForce(pos.x * force, pos.y * force, pos.z * force);
       
      }
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  transparent: true,
  antialias: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [MainScene],
  ...Canvas({ antialias: true }),
};

window.addEventListener("load", () => {
  enable3d(() => new Phaser.Game(config)).withPhysics("/lib/ammo/kripken");
});
