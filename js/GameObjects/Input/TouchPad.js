"use strict" ;



class TouchPad extends Pad {

    _mesh ;

    constructor(resourceManager, padId, frameLog) {
        super(resourceManager, null, padId, frameLog) ;
        this._mesh = this._resourceManager.constructTouchInput() ;
    }

    getScreenPositionInPixels() {

        // this._mesh.updateMatrix() ;
        // this._mesh.updateWorldMatrix() ;
        // Get 3D positions of top left corner (assuming they're not rotated)

        let worldPosition = new THREE.Vector3() ;
        let worldScale = new THREE.Vector3() ;


        this._mesh.getWorldPosition(worldPosition) ;
        this._mesh.getWorldScale(worldScale) ;
        let topLeft = new THREE.Vector3(
            worldPosition.x - (worldScale.x / 2.0),
            worldPosition.y + (worldScale.y / 2.0),
            worldPosition.z
        );

        let downRight = new THREE.Vector3(
            worldPosition.x + (worldScale.x / 2.0),
            worldPosition.y - (worldScale.y / 2.0),
            worldPosition.z
        );

        // engine.camera.updateMatrixWorld();
        topLeft.project(engine.camera);
        downRight.project(engine.camera);

        const topLeftX = (1 + topLeft.x) / 2 * window.innerWidth;
        const topLeftY = (1 - topLeft.y) / 2 * window.innerHeight;

        const downRightX = (1 + downRight.x) / 2 * window.innerWidth;
        const downRightY = (1 - downRight.y) / 2 * window.innerHeight;

        return [topLeftX, topLeftY, downRightX, downRightY] ;

    }


    touched(x, y) {

        let [topLeftX, topLeftY, downRightX, downRightY] = this.getScreenPositionInPixels() ;

        let square = (downRightX-topLeftX) / 3.0 ;
        let rectangle = (downRightX-topLeftX) / 2.0 ;

        //1st col
        if ( x > topLeftX && x <= topLeftX + square ) {

           if  (y > topLeftY && y <= topLeftY + rectangle) {
               return 'ul' ;
           } else if (y > topLeftY + rectangle && y <= downRightY) {
               return 'dl'
           } else {
               return 'none' ;
           }

        //2nd col
        } else if ( x > topLeftX + square && x <= downRightX - square) {

            if ( y > topLeftY && y <= topLeftY + square) {


                if ( x <= topLeftX + rectangle ) {
                    return 'ul' ;
                } else {
                    return 'ur' ;
                }


            } else if ( y > topLeftY + square && y <= downRightY - square) {
                return 'c' ;
            } else if ( y > downRightY - square && y <= downRightY) {

                if ( x <= topLeftX + rectangle ) {
                    return 'dl' ;
                } else {
                    return 'dr' ;
                }

            } else {
                return 'none' ;
            }

        //3rd col
        } else if (x > downRightX - square && x<= downRightX ) {


            if  (y > topLeftY && y <= topLeftY + rectangle) {
                return 'ur' ;
            } else if (y > topLeftY + rectangle && y <= downRightY) {
                return 'dr'
            } else {
                return 'none' ;
            }

        } else {
            return 'none' ;
        }


    }


    get object () {
        return this._mesh;
    }


}