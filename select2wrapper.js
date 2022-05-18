(function ($) {
    /**
     *
     * @param options {placeholder:null,url:null,labelfld;null}
     */
    $.fn.select2wrapper = function(options) {

        if(this.hasClass("select2")) {
            this.select2('destroy');
        }

        let opts = {
            placeholder: "",
            allowClear: true
        };

        Object.assign(opts,this.data());
        delete opts.komponent;
        delete opts.instance;
        Object.assign(opts,options);

        if (!opts.searchfld && opts.labelfld === "function")
            throw new Exception("Select2Wrapper - invalid searchfld");

        let searchfld = opts.searchfld ? opts.searchfld : opts.labelfld;
        let select = this;

        opts.ajax = {
            url: opts.url,
            minimumInputLength: 2,
            dataType: 'json',
            data: (params)=>{
                let limit = 5;
                let p = {
                    "page[partners][offset]":params.page?(params.page-1)*limit:0,
                    "page[partners][limit]":limit
                };

                if(params.term) {
                    if(typeof searchfld === "function") {
                        p.filter = searchfld(params);
                    }
                    else {
                        p.filter = searchfld + "~=~" + params.term;
                    }
                }

                return p;
            },
            processResults: function (data) {
                let result = {results:[]};
                data.data.forEach(function (item) {
                    result.results.push({
                        id: typeof opts.idfld==="undefined" ? item.id :
                            (typeof opts.idfld==="function" ? opts.idfld(item) : item.attributes[opts.idfld]),
                        text: typeof opts.labelfld==="function" ? opts.labelfld(item) : item.attributes[opts.labelfld],
                    })
                });
                $(select).data("datasource",data.data);
                return result;
            }
        };
        console.log(opts);
        if(typeof opts.disableSearch!=="undefined" && opts.disableSearch) {
            opts.minimumResultsForSearch = -1;
        }

        console.log("opts",opts);
        // return ;
        this.select2(opts);

        return this;

    }
})($);

