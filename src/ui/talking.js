let advancedTexture;
let rect1, text1;
let talking = false;

let guiTexture;
import prompt_ui from './prompt.json'
import alert_ui from './alert.json'
import confirm_ui from './confirm.json'

export function ask(mesh, text, list, scene) {
    return new Promise((resolve, reject) => {
        if (talking) {
            reject();
            return;
        }
        talking = true;
        var plane = BABYLON.Mesh.CreatePlane("plane", 2, scene);

        plane.position.y = 3;
        plane.parent = mesh;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        //    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
        rect1 = new BABYLON.GUI.Rectangle();
        rect1.width = "2500px";
        rect1.height = "420px";
        rect1.cornerRadius = 20;
        rect1.color = "Orange";
        rect1.thickness = 4;
        rect1.background = "green";
        advancedTexture.addControl(rect1);
        let btns = [];
        var panel = new BABYLON.GUI.StackPanel('panel');
        rect1.addControl(panel);
        text1 = new BABYLON.GUI.TextBlock('text');
        text1.text = "Hello world";
        text1.color = "white";
        text1.fontSize = 60;
        text1.text = text;
        text1.height = "80px";
        // text1.textWrapping=true;
        text1.resizeToFit = true;
        panel.addControl(text1);

        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", item);
            button1.width = 1;
            button1.height = "80px"
            button1.color = "white";
            button1.fontSize = 50;
            button1.background = "green";
            button1.onPointerUpObservable.add(function () {
                for (let b of btns) {
                    panel.removeControl(b);
                    b.dispose();
                }
                rect1.removeControl(panel)
                panel.dispose();
                advancedTexture.dispose();
                scene.removeMesh(plane);
                plane.dispose();
                talking = false;
                resolve(i);
            });
            btns.push(button1);
            panel.addControl(button1);
        }

    })

}

export function input(mesh, text, scene) {
    return new Promise((resolve, reject) => {
        if (talking) {
            reject();
            return;
        }
        talking = true;
        var plane = BABYLON.Mesh.CreatePlane("plane", 2, scene);

        plane.position.y = 3;
        plane.parent = mesh;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
        rect1 = new BABYLON.GUI.Rectangle();
        rect1.width = "2500px";
        rect1.height = "420px";
        rect1.cornerRadius = 20;
        rect1.color = "Orange";
        rect1.thickness = 4;
        rect1.background = "green";
        advancedTexture.addControl(rect1);
        let btns = [];
        var panel = new BABYLON.GUI.StackPanel('panel');
        rect1.addControl(panel);

        text1 = new BABYLON.GUI.TextBlock('text');
        text1.text = "Hello world";
        text1.color = "white";
        text1.fontSize = 60;
        text1.text = text;
        text1.height = "80px";

        text1.resizeToFit = true;

        panel.addControl(text1);

        var input = new BABYLON.GUI.InputText();
        input.width = 0.2;
        input.maxWidth = 0.2;
        input.height = "80px";
        input.text = "";
        input.fontSize = 60;
        input.color = "white";
        input.background = "green";

        panel.addControl(input);

        const list = ['OK'];
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", item);
            button1.width = 0.5;
            button1.height = "80px"
            button1.color = "white";
            button1.fontSize = 50;
            button1.background = "green";
            button1.onPointerUpObservable.add(function () {
                for (let b of btns) {
                    panel.removeControl(b);
                    b.dispose();
                }
                panel.removeControl(input)
                input.dispose();
                rect1.removeControl(panel)
                panel.dispose();
                advancedTexture.dispose();
                scene.removeMesh(plane);
                plane.dispose();
                talking = false;
                resolve(input.text);
            });
            btns.push(button1);
            panel.addControl(button1);
        }

    })

}

export function guiPrompt(text) {
    return new Promise((resolve, reject) => {
        guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiTexture.parseSerializedObject(prompt_ui)
        let children = guiTexture.getChildren()[0].children;
        var textBlock = children.filter(control => control.name === "Textblock")[0];
        var inputText = children.filter(control => control.name === "InputText")[0];
        textBlock.text = text;
        var okBtn = children.filter(control => control.name === "okBtn")[0];
        var cancelBtn = children.filter(control => control.name === "cancelBtn")[0];
        okBtn.onPointerUpObservable.add( () => {
            resolve(inputText.text);
            guiTexture.dispose();
        })
        cancelBtn.onPointerUpObservable.add(  () => {
            resolve('');
            guiTexture.dispose();
        })
    })
}

export function guiAlert(text) {
    return new Promise((resolve, reject) => {
        guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiTexture.parseSerializedObject(alert_ui)
        let children = guiTexture.getChildren()[0].children;
        var textBlock = children.filter(control => control.name === "Textblock")[0];
        textBlock.text = text;
        var okBtn = children.filter(control => control.name === "okBtn")[0];
        okBtn.onPointerUpObservable.add( () => {
            resolve();
            guiTexture.dispose();
        })
    })
}


export function guiConfirm(text) {
    return new Promise((resolve, reject) => {
        guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiTexture.parseSerializedObject(confirm_ui)
        let children = guiTexture.getChildren()[0].children;
        var textBlock = children.filter(control => control.name === "Textblock")[0];
        textBlock.text = text;
        var okBtn = children.filter(control => control.name === "okBtn")[0];
        okBtn.onPointerUpObservable.add( () => {
            resolve(true);
            guiTexture.dispose();
        })

        var cancelBtn = children.filter(control => control.name === "cancelBtn")[0];
        cancelBtn.onPointerUpObservable.add( () => {
            resolve(false);
            guiTexture.dispose();
        })
    })
}