///////////// box
let box1 = this.third.add.box({ x: 10, y: 12, z: 20 });
    this.third.physics.add.existing(box1, { breakable: true });


    //////////////////// house

    addHouse() {
        const commonSetting = {
          depth: 0.4,
          breakable: true,
          fractureImpulse: 5,
          collisionFlags: 3,
          
        };
        const mat = { custom: new THREE.MeshLambertMaterial({ color: 0x2194ce }) }
        let posx = 45;
        let posz = 45;
        // front
        this.third.physics.add.box({
          y: 3,
          x: 2 + posx,
          z: 4 + posz,
          width: 4,
          height: 2,
          ...commonSetting,
          
        },mat);
        this.third.physics.add.box({
          y: 1,
          x: 2 + posx,
          z: 4 + posz,
          width: 4,
          height: 2,
          ...commonSetting,
        },mat);
        this.third.physics.add.box({
          y: 1,
          x: -2 + posx,
          z: 4 + posz,
          width: 4,
          height: 2,
          ...commonSetting,
        },mat);
        this.third.physics.add.box({
          y: 3,
          x: -2 + posx,
          z: 4 + posz,
          width: 4,
          height: 2,
          ...commonSetting,
        },mat);
    
        // back
        this.third.physics.add.box({
          y: 1,
          x: -2 + posx,
          z: posz,
          width: 4,
          height: 2,
          ...commonSetting,
        },mat);
        this.third.physics.add.box({
          y: 3,
          x: -2 + posx,
          z: posz,
          width: 4,
          height: 2,
          ...commonSetting,
        },mat);
        this.third.physics.add.box({
          y: 1,
          x: 2 + posx,
          z: posz,
          width: 4,
          height: 2,
          ...commonSetting,
        },mat);
        this.third.physics.add.box({
          y: 3,
          x: 2 + posx,
          z: posz,
          width: 4,
          height: 2,
          ...commonSetting,
        },mat);
    
        // left and right
        this.third.physics.add.box({
          ...commonSetting,
          y: 2,
          x: -4 + posx,
          z: 2 + posz,
          depth: 4,
          height: 4,
          width: 1,
        },mat);
        this.third.physics.add.box({
          ...commonSetting,
          y: 2,
          x: 4 + posx,
          z: 2 + posz,
          depth: 4,
          height: 4,
          width: 1,
        },mat);
    
        // roof
        let r1 = this.third.add.box({
          y: 4.75,
          x: 0 + posx,
          z: 0.5 + posz,
          width: 8,
          height: 4,
          ...commonSetting,
        });
        let r2 = this.third.add.box({
          y: 4.75,
          x: 0 + posx,
          z: 3.5 + posz,
          width: 8,
          height: 4,
          ...commonSetting,
        });
        r1.rotateX(Math.PI / 4);
        r2.rotateX(-Math.PI / 4);
        this.third.physics.add.existing(r1, {
          collisionFlags: 3,
          breakable: true,
          fractureImpulse: 5,
        });
        this.third.physics.add.existing(r2, {
          collisionFlags: 3,
          breakable: true,
          fractureImpulse: 5,
        });
      }
    




    ///////////////////// stage
    
    this.third.load.fbx('/assets/glb/fbxstairs.fbx').then(object => {

      this.stairs = new ExtendedObject3D()
      this.stairs.add(object)
      console.log(object)
      this.third.add.existing(this.stairs);
    this.stairs.position.set(15,0,15)
    // this.stairs.scale.set(5,5,5)
    this.third.physics.add.existing(this.stairs,{
      shape: 'concave',
      mass: 0,
      collisionFlags: 1,
      autoCenter: false
    })
    this.stairs.traverse((child) => {
      if (child.isMesh) {
        // console.log('child',child.material)
        child.castShadow = child.receiveShadow = true;
        if (child.material) child.material.metalness = 0, child.material.roughness = 1;

      }
    });

    })












    this.third.load.fbx('/assets/fbx/OpenBarn.fbx').then(object => {

        this.barn = new ExtendedObject3D()
        this.barn.add(object)
        console.log(object)
        this.third.add.existing(this.barn);
      this.barn.position.set(50,0,-50)
      this.barn.scale.set(0.02,0.02,0.02)
      this.third.physics.add.existing(this.barn,{
        shape: 'concave',
        mass: 100000,
        collisionFlags: 0,
        autoCenter: false,
        
      },{breakable:true})
      this.barn.traverse((child) => {
        if (child.isMesh) {
          // console.log('child',child.material)
          child.castShadow = child.receiveShadow = true;
          if (child.material) child.material.metalness = 0, child.material.roughness = 1;
  
        }
      });
  
      })
  
      this.third.load.fbx('/assets/fbx/fence.fbx').then(object => {
  
        this.fence = new ExtendedObject3D()
        this.fence.add(object)
        console.log(object)
        this.third.add.existing(this.fence);
      this.fence.position.set(10,0,-10)
      this.fence.scale.set(0.01,0.01,0.01)
      this.third.physics.add.existing(this.fence,{
        shape: 'concave',
        mass: 100000,
        collisionFlags: 0,
        autoCenter: false,
        
      },{breakable:true})
      this.fence.traverse((child) => {
        if (child.isMesh) {
          // console.log('child',child.material)
          child.castShadow = child.receiveShadow = true;
          if (child.material) child.material.metalness = 0, child.material.roughness = 1;
  
        }
      });
  
      })
  
      this.third.load.fbx('/assets/fbx/fence2.fbx').then(object => {
  
        this.fence2 = new ExtendedObject3D()
        this.fence2.add(object)
        console.log(object)
        this.third.add.existing(this.fence2);
      this.fence2.position.set(50,0,-50)
      this.fence2.scale.set(0.02,0.02,0.02)
      this.third.physics.add.existing(this.fence2,{
        shape: 'concave',
        mass: 100000,
        collisionFlags: 0,
        autoCenter: false,
        
      },{breakable:true})
      this.fence2.traverse((child) => {
        if (child.isMesh) {
          // console.log('child',child.material)
          child.castShadow = child.receiveShadow = true;
          if (child.material) child.material.metalness = 0, child.material.roughness = 1;
  
        }
      });
  
      })