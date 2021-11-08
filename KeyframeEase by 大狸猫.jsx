
function main() {
    ///// info
    var scriptName = "大狸猫box";
    var alertTitle = "大狸猫提示你：";
    this.scriptTitle = "KeyframeEase by 大狸猫";
    // var curComp = app.project.activeItem;
    // var time = app.project.activeItem.time;
    // var fps = 1/app.project.activeItem.frameDuration;
    // var selectedLayers = app.project.activeItem.selectedLayers;

    function layerCut (inType){
        var time = app.project.activeItem.time;
        var selectedLayers = app.project.activeItem.selectedLayers;
        if(inType == 0){
            for(var i = 0;i<selectedLayers.length;i++){
                if(selectedLayers[i].inPoint<time&&selectedLayers[i].outPoint>time){
                    var outPointSave = selectedLayers[i].outPoint;
                    selectedLayers[i].inPoint = time;
                    selectedLayers[i].outPoint = outPointSave;
                }
            }
        }else if(inType == 1){
            for(var i = 0;i<selectedLayers.length;i++){
                if(selectedLayers[i].inPoint<time&&selectedLayers[i].outPoint>time){
                    selectedLayers[i].outPoint = time+app.project.activeItem.frameDuration;
                }
            }
        }
    }

    function linear(a,b,c,d,e){
        var newa = (a-b)*(e-d)/(c-b)+d;
        if(newa>e){newa = e};
        if(newa<d){newa = d};
        if(newa%1 !=0){newa = newa.toFixed(2)}
        return newa;
    }

    function clamp(a,b,c){
        if(a>c){a = c};
        if(a<b){a = b};
        return a;
    }

    function layerMove (inType){
        var time = app.project.activeItem.time;
        var selectedLayers = app.project.activeItem.selectedLayers;
        if(inType == 0){
            var a = 'inPoint';
        }else if(inType == 1){
            var a = 'outPoint';
        }
        var minIn = selectedLayers[0][a];
        for(var i = 0;i<selectedLayers.length;i++){
            if(inType^(minIn>selectedLayers[i][a])){minIn = selectedLayers[i][a];}
        }
        for(var i = 0;i<selectedLayers.length;i++){
            selectedLayers[i].startTime = selectedLayers[i].startTime + time - minIn;
        }
    }

    var framenum = 0;
    var snapBox = 1;

    function layerOffset(){
        var thisComp = app.project.activeItem;
        var secL = thisComp.selectedLayers; // 选择层
        var fdr = thisComp.frameDuration;
        var firstINP = secL[0].inPoint;
        var timeDif = 0;
        for(var i=0;i<secL.length;i++){
            if(i == 0 && snapBox == 1){
                secL[i].startTime += thisComp.time - secL[i].inPoint;
            }
            if(i!=0){
                timeDif = secL[i].inPoint - secL[i].startTime;
                secL[i].startTime = firstINP + framenum*fdr*i - timeDif;
            }
        }
    }

    this.buildUI = function (thisObj)
    {
        // dockable panel or palette
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptTitle, undefined, {resizeable:true});
        
        // resource specifications
        var res =
        "group { orientation:'column', alignment:['left','top'], alignChildren:['left','center'], \
            gr1: Group { \
                influenceSt: StaticText { text:'Influence' ,preferredSize:[50,17]}    \
                influenceSlider: Slider { alignment:['left','center'], preferredSize:[100,17],minvalue:0 ,maxvalue:10,value:0 } \
                influenceEt: EditText { text:'0',alignment:['left','center'], preferredSize:[45,17] } \
                applyBtn: Button { text:'Apply',alignment:['left','top'],preferredSize:[70,17] } \
            }, \
            gr2: Group { \
                spaceSt: StaticText { text:'Space',preferredSize:[50,17] }    \
                spaceSlider: Slider { alignment:['left','center'], preferredSize:[100,17],minvalue:0 ,maxvalue:20,value:10 } \
                spaceEt: EditText { text:'100',alignment:['left','center'], preferredSize:[45,17] } \
                extractBtn: Button { text:'Extract',alignment:['left','top'],preferredSize:[70,17] } \
            }, \
            gr3: Group { orientation:'row', alignment:['left','top'],\
                frameSt: StaticText { text:'Frame' ,preferredSize:[40,17]}    \
                minEt: EditText { text:'0',alignment:['left','center'], preferredSize:[25,17] } \
                frameSlider: Slider { alignment:['left','center'], preferredSize:[43,17],minvalue:0 ,maxvalue:30,value:0 } \
                maxEt: EditText { text:'30',alignment:['left','center'], preferredSize:[25,17] } \
                snapBox: Checkbox { text:'[',value:1,alignment:['left','top']}    \
                frameEt: EditText { text:'0',alignment:['left','center'], preferredSize:[38,17] } \
                bakeBtn: Button { text:'Bake',alignment:['left','top'],preferredSize:[40,17] } \
            }, \
        }";
        pal.gr = pal.add(res);
        
        var influence = 0;
        var space = 100;

        // event callbacks
        pal.onResizing = pal.onResize = function () 
        {
            this.layout.resize();
        };
            //influence
        pal.gr.gr1.influenceEt.onChange = function () 
        {
            this.text = eval(this.text);
            if (isNaN(this.text))
            {
                this.text = 0;
            }
            this.parent.influenceSlider.value = Math.round(this.text%100)/10;
            influence = clamp(0,100);
            influence = parseFloat(this.text);
        }
        pal.gr.gr1.influenceSlider.onChange = pal.gr.gr1.influenceSlider.onChanging = function () 
        {
            this.value = Math.round(this.value);
            this.parent.influenceEt.text = this.value*10;
            influence = this.value*10;
            if(app.project.activeItem.selectedProperties.length != 0){
                pal.gr.gr1.applyBtn.onClick();
            }
        };
            // space
        pal.gr.gr2.spaceEt.onChange = function () 
        {
            this.text = eval(this.text);
            if (isNaN(this.text))
            {
                this.text = 0;
            }
            this.parent.spaceSlider.value = Math.round(this.text)/10;
            space = clamp(0,200);
            space = parseFloat(this.text);
        }
        pal.gr.gr2.spaceSlider.onChange = pal.gr.gr2.spaceSlider.onChanging = function () 
        {
            this.value = Math.round(this.value);
            this.parent.spaceEt.text = this.value*10;  
            space = this.value*10;
            if(app.project.activeItem.selectedProperties.length != 0){
                pal.gr.gr1.applyBtn.onClick();
            }
        };
            // apply
        pal.gr.gr1.applyBtn.onClick = function () 
        {
            app.beginUndoGroup(scriptName);
            
            // var influence2 = linear(influence,0,100,50,150);
            // if(influence2<100){
            //     var infOut = clamp(influence2-space*0.5,0.1,100);
            //     var infIn = clamp(200-infOut,0.1,100);
            // }else{
            //     var infIn = clamp(200-influence2-space*0.5,0.1,100);
            //     var infOut = clamp(200-infIn,0.1,100);
            // }

            var infOut = clamp(influence,0.1,100);
            var infIn = clamp(200-space-influence,0.1,100);

            var selectedLayers = app.project.activeItem.selectedLayers;
            var curComp = app.project.activeItem;

            var easeOut = new KeyframeEase(0, infOut);
            var easeIn = new KeyframeEase(0, infIn);
            
            for(var i = 0;i<selectedLayers.length;i++){
                for(var j = 0;j<selectedLayers[i].selectedProperties.length;j++){
                    if(selectedLayers[i].selectedProperties[j].canSetExpression){

                        var easeOutAll = [];
                        var easeInAll = [];
                        var prop = selectedLayers[i].selectedProperties[j];

                        if ( !prop.isSpatial && prop.value.length == 3 ) {
                            easeOutAll = [easeOut,easeOut,easeOut];
                            easeInAll = [easeIn,easeIn,easeIn];
                        } else if ( !prop.isSpatial && prop.value.length == 2 ) {
                            easeOutAll = [easeOut,easeOut];
                            easeInAll = [easeIn,easeIn];
                        } else {
                            easeOutAll = [easeOut];
                            easeInAll = [easeIn];
                        }
                        
                        for(var k = 0;k< prop.selectedKeys.length;k++){
                            var curKeys = prop.selectedKeys;
                            prop.setTemporalContinuousAtKey(curKeys[k], 1);
                            prop.setTemporalEaseAtKey(curKeys[k],easeInAll,easeOutAll);
                        }
                    }
                }
            }

            app.endUndoGroup;
        };
            // extract
        pal.gr.gr2.extractBtn.onClick = function () 
        {
            app.beginUndoGroup(scriptName);
            var selectedLayers = app.project.activeItem.selectedLayers;
            for(var j = 0;j<selectedLayers[0].selectedProperties.length;j++){
                if(selectedLayers[0].selectedProperties[j].canSetExpression){
                    var curProperties = selectedLayers[0].selectedProperties[j];
                    var curKeys = selectedLayers[0].selectedProperties[j].selectedKeys;
                    var influenceA = curProperties.keyOutTemporalEase(curKeys[0])[0].influence;
                    var influenceB = curProperties.keyInTemporalEase(curKeys[1])[0].influence;
                    
                    if(influenceA <= 0.1){
                        pal.gr.gr1.influenceSlider.value = 0;
                        pal.gr.gr1.influenceEt.text = 0;
                    }else{
                        pal.gr.gr1.influenceSlider.value = influenceA/10;
                        pal.gr.gr1.influenceEt.text = influenceA;
                    }

                    if(influenceB <= 0.1){
                        pal.gr.gr1.influenceSlider.value = (200 - influenceA)/10;
                        space = 200 - influenceA;
                    }else{
                        pal.gr.gr2.spaceSlider.value = (200 - influenceB - influenceA)/10;
                        space = 200 - influenceB - influenceA;
                    }
                    pal.gr.gr2.spaceEt.text = space;

                    influence = influenceA;
                    

                }
                selectedLayers[i].selectedProperties[j].expressionEnabled = 0;
            }
            app.endUndoGroup;
        }

            //frame
        pal.gr.gr3.frameEt.onChange = function () 
        {
            this.text = eval(this.text);
            if (isNaN(this.text))
            {
                this.text = 0;
            }
            this.parent.frameSlider.value = Math.round(this.text);
            framenum = parseInt(this.text);
            if(app.project.activeItem.selectedLayers.length > 1){
                layerOffset();
            }
        }
    
            // frameSlider min
        pal.gr.gr3.minEt.onChange = function () 
        {
            this.text = eval(this.text);
            if (isNaN(this.text))
            {
                this.text = 0;
            }
            this.parent.frameSlider.minvalue = Math.round(this.text);
        }
    
            // frameSlider max
        pal.gr.gr3.maxEt.onChange = function () 
        {
            this.text = eval(this.text);
            if (isNaN(this.text))
            {
                this.text = 0;
            }
            this.parent.frameSlider.maxvalue = Math.round(this.text);
        }
    

        pal.gr.gr3.frameSlider.onChange = pal.gr.gr3.frameSlider.onChanging = function () 
        {
            app.beginUndoGroup(scriptName);
            this.value = Math.round(this.value);
            this.parent.frameEt.text = this.value;
            framenum = this.value;
            if(app.project.activeItem.selectedLayers.length > 1){
                layerOffset();
            }
            app.endUndoGroup;
        };
    
        pal.gr.gr3.snapBox.onClick = function () 
        {
            snapBox = this.value;
        }

            // bake
        pal.gr.gr3.bakeBtn.onClick = function () 
        {
            app.beginUndoGroup(scriptName);
            var selectedLayers = app.project.activeItem.selectedLayers;
            for(var i = 0;i<selectedLayers.length;i++){
                for(var j = 0;j<selectedLayers[i].selectedProperties.length;j++){
                    if(selectedLayers[i].selectedProperties[j].canSetExpression){
                        if(selectedLayers[i].selectedProperties[j].expression != "" && selectedLayers[i].selectedProperties[j].expressionEnabled == 1){
                            for(var k = 0;k<selectedLayers[i].selectedProperties[j].selectedKeys.length;k++){
                                var curProperties = selectedLayers[i].selectedProperties[j];
                                var curKeys = selectedLayers[i].selectedProperties[j].selectedKeys;
                                var newValue = selectedLayers[i].selectedProperties[j].valueAtTime(curProperties.keyTime(curKeys[k]),0);
                                selectedLayers[i].selectedProperties[j].setValueAtKey(curKeys[k],newValue);
                            }
                        }
                    }
                    selectedLayers[i].selectedProperties[j].expressionEnabled = 0;
                }
            }
            app.endUndoGroup;
        }
        // show user interface
        if (pal instanceof Window)
        {
            pal.center();
            pal.show();
        }
        else
        {
            pal.layout.layout(true);
        }       
    };
    this.run = function (thisObj) 
    {
            this.buildUI(thisObj);
    };
}
new main().run(this)
