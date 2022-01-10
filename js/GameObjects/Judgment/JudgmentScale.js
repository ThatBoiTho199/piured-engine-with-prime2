"use strict" ;


class JudgmentScale extends GameObject {

    _judgment ;
    _lifeBar ;
    _state = 0 ;
    _counter = 0 ;
    _barSteps = 60 ;
    _currentStep = 30 ;
    _frameLog ;

    constructor(resourceManager, accuracyMargin, lifeBar, frameLog) {

        super(resourceManager) ;

        this._lifeBar = lifeBar ;
        this.accuracyMargin = accuracyMargin ;

        this._judgment = new Judgment(this._resourceManager) ;
        this._frameLog = frameLog ;

    }


    get performance() {
        return this.stats ;
    }

    ready() {

        this.comboCount = 0 ;
        this.missComboCount = 0 ;

        this.stats = {
            p:0,
            gr:0,
            go:0,
            b:0,
            m:0
        }
    }

    update(delta) {

        if (this._currentStep <= 0) {
            this._currentStep = 0 ;
        }

    }

// TODO:
    miss ( comboIncrement = 1 ) {
        this.comboCount = 0 ;
        this.missComboCount += comboIncrement ;
        this.stats.m += comboIncrement;
        this._judgment.animate('m',this.comboCount) ;


        if (this._currentStep > 60 ) {
            this._state = 5;
            this._counter = 0;
            this._currentStep = 60 ;
        }

        if ( this._state === 5 ) {
            if ( this._counter >=3 ) {
                this._currentStep = 54 ;
                this._state = 0 ;
                this._counter = 0 ;
            } else {
                this._counter += 1 ;
            }
        } else {
            this._currentStep -= 6 ;
            this._counter = 0 ;
            this._state = 0 ;
        }

        this._lifeBar.setsize( this._currentStep/this._barSteps ) ;

        this._frameLog.logJudgment( 'm',this.comboCount, this._currentStep ) ;

    }
    bad ( ) {
        this.missComboCount = 0;
        this.comboCount = 0 ;
        this.stats.b += 1;
        this._judgment.animate('b',this.comboCount) ;

        this._state = 0 ;
        this._counter = 0 ;

        this._frameLog.logJudgment( 'b',this.comboCount, this._currentStep ) ;
    }

    good ( ) {
        this.missComboCount = 0 ;
        this.stats.go += 1;
        this._judgment.animate('go',this.comboCount) ;

        this._state = 0 ;
        this._counter = 0 ;

        this._frameLog.logJudgment( 'go',this.comboCount, this._currentStep ) ;

    }

    great ( ) {
        this.missComboCount = 0;
        this.stats.gr += 1;
        this.comboCount += 1 ;
        this._judgment.animate('gr',this.comboCount) ;

        if (this._state === 5 ) {
            this._state = 0 ;
        }

        this.counterUpdatePerfect(7,0,1) ;

        this._frameLog.logJudgment( 'gr',this.comboCount, this._currentStep ) ;

    }

    perfect ( comboIncrement = 1 ) {
        this.missComboCount = 0 ;
        this.stats.p += 1;
        this.comboCount += comboIncrement ;
        this._judgment.animate('p',this.comboCount) ;

        if (this._state === 5 ) {
            this._state = 0 ;
        }


        this.counterUpdatePerfect(7,0,1, comboIncrement) ;
        this.counterUpdatePerfect(6,1,2, comboIncrement) ;
        this.counterUpdatePerfect(4,2,3, comboIncrement) ;
        this.counterUpdatePerfect(2,3,3, comboIncrement) ;

        this._frameLog.logJudgment( 'p',this.comboCount, this._currentStep ) ;

    }

    counterUpdatePerfect(updateCondition, fromState, toState, comboIncrement) {
        if ( this._state === fromState) {
            if (this._counter < updateCondition-1 ) {
                this._counter += comboIncrement ;
            } else {
                this._currentStep += 1 ;
                this._counter = 0 ;
                this._state = toState ;
                this._lifeBar.setsize( this._currentStep/this._barSteps ) ;
            }
        }
    }



    grade(timeElapse) {

        const tiersTime = this.accuracyMargin / 8;
        const tier = Math.floor( timeElapse / tiersTime ) ;



        let grade = null ;

        switch (tier) {
            case 0:
            case 1:
            case 2:
                this.perfect() ;
                grade = 'p' ;
                break ;
            case 3:
            case 4:
                this.great() ;
                grade =  'gr' ;
                break ;
            case 5:
            case 6:
                this.good() ;
                grade =  'go' ;
                break ;
            case 7:
                this.bad() ;
                grade =  'b' ;
                break ;

        }

        return grade ;

    }

    setJudgment(grade, combo, step) {
        this.comboCount = combo ;
        this._currentStep = step ;
        this._lifeBar.setsize( this._currentStep/this._barSteps ) ;
        this._judgment.animate( grade, this.comboCount );
    }

    get object() {
        return this._judgment.object ;
    }



}