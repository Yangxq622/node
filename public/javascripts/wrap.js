var wrapBox = {
    init: function (obj) {
        this.option = {
            width:400,
            height:400,
            headerTip:"提示信息",
            headerContent:"提示内容",
            cancelContent:{
                html:"取消",
                fn: function () {

                }
            },
            confirmContent:{
                html:"确定",
                fn: function () {

                }
            }
        };
        this.change(obj);
        this.create();
        this.bindEvent();
        this.bindMoveEvent();
    },
    change: function (obj) {
        for (var i in obj){
            this.option[i] = obj[i];
        }
    },
    bindMoveEvent: function () {
        var that = this;
        this.wrap.onmousedown = function (e) {
            var evt = window.event || e;
            var offsetX = evt.pageX - that.wrap.offsetLeft;
            var offsetY = evt.pageY - that.wrap.offsetTop;

            that.wrap.onmousemove = function (e) {
                var evt = window.event || e;

                var x = evt.pageX - offsetX;
                var y = evt.pageY - offsetY;

                that.wrap.style.left = x + "px";
                that.wrap.style.top = y + "px";
            }
            that.wrap.onmouseup = function () {
                that.wrap.onmousemove = null;
            }
        }
    },
    create: function () {
        if (this.wrap){
            this.header.innerHTML = this.option.headerTip;
            this.content.innerHTML = this.option.headerContent;
            this.cancel.innerHTML= this.option.cancelContent.html;
            this.confirm.innerHTML = this.option.confirmContent.html;
            this.show();
        }else {
            this.wrap = document.createElement("div");
            this.wrap.className = "wrap";
            document.body.appendChild(this.wrap);

            this.header = document.createElement("div");
            this.header.className = "wrap-header";
            this.header.innerHTML = this.option.headerTip;
            this.wrap.appendChild(this.header);

            this.content = document.createElement("div");
            this.content.className = "wrap-content";
            this.content.innerHTML = this.option.headerContent;
            this.wrap.appendChild(this.content);

            this.footer = document.createElement("div");
            this.footer.className = "wrap-footer";
            this.wrap.appendChild(this.footer);

            this.cancel = document.createElement("span");
            this.cancel.className = "wrap-footer-cancel";
            this.cancel.innerHTML= this.option.cancelContent.html;
            this.footer.appendChild(this.cancel);

            this.confirm = document.createElement("span");
            this.confirm.className = "wrap-footer-confirm";
            this.confirm.innerHTML = this.option.confirmContent.html;
            this.footer.appendChild(this.confirm);
        }
        this.wrap.style.width = this.option.width + "px";
        this.wrap.style.height = this.option.height + 70 + "px";
        this.header.style.width = this.option.width + "px";
        this.content.style.width = this.option.width + "px";
        this.content.style.height = this.option.height + "px";
        this.footer.style.width = this.option.width + "px";

        var initX = ((document.documentElement.scrollWidth || document.body.scrollWidth) - this.option.width) / 2;
        var initY = ((document.documentElement.scrollHeight || document.body.scrollHeight) - (this.option.height + 70)) / 2;

        this.wrap.style.left = initX + "px";
        this.wrap.style.top = initY + "px";
    },
    bindEvent: function () {
        var that = this;
        this.cancel.onclick = function () {
            that.option.cancelContent.fn();
            that.hide();
        };
        this.confirm.onclick = function () {
            that.option.confirmContent.fn();
            that.hide();
        };
    },
    hide: function () {
        this.wrap.style.display = "none";
    },
    show: function () {
        this.wrap.style.display = "block";
    }
};
