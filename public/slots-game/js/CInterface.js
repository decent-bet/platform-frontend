function CInterface(iCurBet, iTotBet, iMoney) {
    var _aLinesBut;
    var _aPayline;
    var _oButExit;
    var _oSpinBut;
    var _oInfoBut;
    var _oAddLineBut;
    var _oAudioToggle;
    var _oBetCoinBut;
    var _oMaxBetBut;
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oCoinText;
    var _oMoneyText;
    var _oTotalBetText;
    var _oNumLinesText;
    var _oWinText;
    var _oButFullscreen;

    this._init = function (iCurBet, iTotBet, iMoney) {

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.width / 2) - 2, y: (oSprite.height / 2) + 2};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, true);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _pStartPosAudio = {x: _oButExit.getX() - oSprite.width, y: (oSprite.height / 2) + 2};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, s_oSpriteLibrary.getSprite('audio_icon'), s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);

            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width, y: _pStartPosAudio.y};
        } else {
            _pStartPosFullscreen = {x: _oButExit.getX() - oSprite.width, y: (oSprite.height / 2) + 2};
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && inIframe() === false) {
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        oSprite = s_oSpriteLibrary.getSprite('spin_but');
        _oSpinBut = new CTextButton(1026 + (oSprite.width / 2), 595, oSprite, TEXT_SPIN, FONT_GAME, "#ffffff", 30);
        _oSpinBut.addEventListener(ON_MOUSE_UP, this._onSpin, this);

        oSprite = s_oSpriteLibrary.getSprite('info_but');
        _oInfoBut = new CTextButton(296 + (oSprite.width / 2), 595, oSprite, TEXT_INFO, FONT_GAME, "#ffffff", 30);
        _oInfoBut.addEventListener(ON_MOUSE_UP, this._onInfo, this);

        oSprite = s_oSpriteLibrary.getSprite('but_lines_bg');
        _oAddLineBut = new CTextButton(436 + (oSprite.width / 2), 595, oSprite, TEXT_LINES, FONT_GAME, "#ffffff", 30);
        _oAddLineBut.addEventListener(ON_MOUSE_UP, this._onAddLine, this);

        oSprite = s_oSpriteLibrary.getSprite('coin_but');
        _oBetCoinBut = new CTextButton(620 + (oSprite.width / 2), 595, oSprite, TEXT_COIN, FONT_GAME, "#ffffff", 30);
        _oBetCoinBut.addEventListener(ON_MOUSE_UP, this._onBet, this);

        oSprite = s_oSpriteLibrary.getSprite('but_maxbet_bg');
        _oMaxBetBut = new CTextButton(805 + (oSprite.width / 2), 595, oSprite, TEXT_MAX_BET, FONT_GAME, "#ffffff", 30);
        _oMaxBetBut.addEventListener(ON_MOUSE_UP, this._onMaxBet, this);

        _oMoneyText = new createjs.Text(TEXT_MONEY + "\n" + iMoney + TEXT_CURRENCY, "24px " + FONT_GAME, "#333333");
        _oMoneyText.x = 408;
        _oMoneyText.y = 14;
        _oMoneyText.textAlign = "center";
        s_oStage.addChild(_oMoneyText);

        _oNumLinesText = new createjs.Text(NUM_PAYLINES, "30px " + FONT_GAME, "#333333");
        _oNumLinesText.x = 530;
        _oNumLinesText.y = CANVAS_HEIGHT - 96;
        _oNumLinesText.textAlign = "center";
        _oNumLinesText.textBaseline = "alphabetic";
        s_oStage.addChild(_oNumLinesText);

        _oCoinText = new createjs.Text(iCurBet.toFixed(2), "30px " + FONT_GAME, "#333333");
        _oCoinText.x = 712;
        _oCoinText.y = CANVAS_HEIGHT - 96;
        _oCoinText.textAlign = "center";
        _oCoinText.textBaseline = "alphabetic";
        s_oStage.addChild(_oCoinText);

        _oTotalBetText = new createjs.Text(TEXT_BET + ": " + iTotBet.toFixed(2), "30px " + FONT_GAME, "#333333");
        _oTotalBetText.x = 918;
        _oTotalBetText.y = CANVAS_HEIGHT - 96;
        _oTotalBetText.textAlign = "center";
        _oTotalBetText.textBaseline = "alphabetic";
        s_oStage.addChild(_oTotalBetText);

        _oWinText = new createjs.Text("", "24px " + FONT_GAME, "#ffde00");
        _oWinText.x = 1116;
        _oWinText.y = CANVAS_HEIGHT - 96;
        _oWinText.textAlign = "center";
        _oWinText.textBaseline = "alphabetic";
        s_oStage.addChild(_oWinText);

        oSprite = s_oSpriteLibrary.getSprite('bet_but');
        _aLinesBut = new Array();

        var iHalfButHeight = oSprite.height / 2;
        var iPadding = 11;
        var iSpriteHeight = 32;
        var iYOffset = 84 + iHalfButHeight;

        //LINE 1
        oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(1));
        oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 1);
        _aLinesBut[0] = oBut;

        iYOffset += iSpriteHeight + iPadding + 1;

        //LINE 2
        oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(2));
        oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 2);
        _aLinesBut[1] = oBut;

        iYOffset += iSpriteHeight + iPadding;

        //LINE 3
        oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(3));
        oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 3);
        _aLinesBut[2] = oBut;

        iYOffset += iSpriteHeight + iPadding;

        //LINE 4
        var oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(4));
        oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 4);
        _aLinesBut[3] = oBut;

        iYOffset += iSpriteHeight + iPadding;

        //LINE 5
        oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(5));
        oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 5);
        _aLinesBut[4] = oBut;

        iYOffset = 84 + iHalfButHeight;

        // //LINE 20
        // oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(20));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 20);
        // _aLinesBut[19] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 16
        // oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(16));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 16);
        // _aLinesBut[15] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 10
        // oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(10));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 10);
        // _aLinesBut[9] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;

        // //LINE 11
        // oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(11));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 11);
        // _aLinesBut[10] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 17
        // oBut = new CBetBut(319 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(17));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 17);
        // _aLinesBut[16] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;

        // //LINE 14
        // var oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, this.isBetButtonEnabled(14));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 14);
        // _aLinesBut[13] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 12
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(12));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 12);
        // _aLinesBut[11] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 9
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(9));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 9);
        // _aLinesBut[8] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 18
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(10));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 18);
        // _aLinesBut[17] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 6;
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(6));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 6);
        // _aLinesBut[5] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding + 1;
        //
        // //LINE 7;
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(7));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 7);
        // _aLinesBut[6] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 19;
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(19));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 19);
        // _aLinesBut[18] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 8
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(8));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 8);
        // _aLinesBut[7] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 13
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(13));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 13);
        // _aLinesBut[12] = oBut;
        //
        // iYOffset += iSpriteHeight + iPadding;
        //
        // //LINE 15
        // oBut = new CBetBut(1130 + oSprite.width / 2, iYOffset, oSprite, this.isBetButtonEnabled(15));
        // oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onBetLineClicked, this, 15);
        // _aLinesBut[14] = oBut;

        _aPayline = new Array();
        for (var k = 0; k < NUM_PAYLINES; k++) {
            var oBmp = createBitmap(s_oSpriteLibrary.getSprite('payline_' + (k + 1)));
            oBmp.visible = false;
            s_oStage.addChild(oBmp);
            _aPayline[k] = oBmp;
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

        // Default lines
        window.lines = 5

        // Default betsize
        window.betSize = 1
    };

    this.isBetButtonEnabled = function (line) {
        return line <= NUM_PAYLINES
    }

    this.unload = function () {
        _oButExit.unload();
        _oButExit = null;
        _oSpinBut.unload();
        _oSpinBut = null;
        _oInfoBut.unload();
        _oInfoBut = null;
        _oAddLineBut.unload();
        _oAddLineBut = null;
        _oBetCoinBut.unload();
        _oBetCoinBut = null;
        _oMaxBetBut.unload();
        _oMaxBetBut = null;

        if (DISABLE_SOUND_MOBILE === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.unload();
        }

        for (var i = 0; i < NUM_PAYLINES; i++) {
            _aLinesBut[i].unload();
        }

        s_oInterface = null;
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };

    this.refreshMoney = function (iMoney) {
        _oMoneyText.text = TEXT_MONEY + "\n" + iMoney.toFixed(2) + TEXT_CURRENCY;
    };

    this.refreshBet = function (iBet) {
        _oCoinText.text = iBet.toFixed(2);
    };

    this.refreshTotalBet = function (iTotBet) {
        _oTotalBetText.text = TEXT_BET + ": " + iTotBet.toFixed(2);
    };

    this.refreshNumLines = function (iLines) {
        _oNumLinesText.text = iLines;
        window.lines = iLines;

        for (var i = 0; i < NUM_PAYLINES; i++) {
            if (i < iLines) {
                _aLinesBut[i].setOn();
                _aPayline[i].visible = true;
            } else {
                _aLinesBut[i].setOff();
            }
        }

        setTimeout(function () {
            for (var i = 0; i < NUM_PAYLINES; i++) {
                _aPayline[i].visible = false;
            }
        }, 1000);
    };

    this.resetWin = function () {
        _oWinText.text = " ";
    };

    this.refreshWinText = function (iWin) {
        _oWinText.text = TEXT_WIN + " " + iWin.toFixed(2) + TEXT_CURRENCY;
    };

    this.showLine = function (iLine) {
        _aPayline[iLine - 1].visible = true;
    };

    this.hideLine = function (iLine) {
        _aPayline[iLine - 1].visible = false;
    };

    this.hideAllLines = function () {
        for (var i = 0; i < NUM_PAYLINES; i++) {
            _aPayline[i].visible = false;
        }
    };

    this.disableBetBut = function (bDisable) {
        for (var i = 0; i < NUM_PAYLINES; i++) {
            _aLinesBut[i].disable(bDisable);
        }
    };

    this.enableGuiButtons = function () {
        _oSpinBut.enable();
        _oBetCoinBut.enable();
        _oAddLineBut.enable();
        _oInfoBut.enable();
    };

    this.enableSpin = function () {
        _oSpinBut.enable();
    };

    this.disableSpin = function () {
        _oSpinBut.disable();
        _oMaxBetBut.disable();
    };

    this.disableGuiButtons = function () {
        _oSpinBut.disable();
        _oMaxBetBut.disable();
        _oBetCoinBut.disable();
        _oAddLineBut.disable();
        _oInfoBut.disable();
    };

    this._onBetLineClicked = function (iLine) {
        this.refreshNumLines(iLine);

        s_oGame.activateLines(iLine);
    };

    this._onExit = function () {
        s_oGame.onExit();
    };

    this._onSpin = function () {
        parent.window.slotsController().spin(window.lines, window.betSize, (err, message, lines) => {
            if(!err) {
                lines = lines.splice(0, 3)
                var temp = lines[0]
                lines[0] = lines[1]
                lines[1] = temp
                console.log('Slots controller: ', err, JSON.stringify(lines))
                s_oGame.onSpin(lines);
            } else
                console.log('Slots controller: Error spinning', err)
        })
    };

    this._onAddLine = function () {
        s_oGame.addLine();
    };

    this._onInfo = function () {
        s_oGame.onInfoClicked();
    };

    this._onBet = function () {
        s_oGame.changeCoinBet();
    };

    this._onMaxBet = function () {
        s_oGame.onMaxBet();
    };

    this._onAudioToggle = function () {
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onFullscreenRelease = function () {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
            s_bFullscreen = false;
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
            s_bFullscreen = true;
        }

        sizeHandler();
    };

    s_oInterface = this;

    this._init(iCurBet, iTotBet, iMoney);

    return this;
}

var s_oInterface = null;
