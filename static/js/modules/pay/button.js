var Button_{{ attr }} = function($('#{{ attr }}'), data){
    this.$el = $("#{{ attr }}");
    console.log("=====", this.$el);
    this.${{ attr }} = this.$el.find('a[data-type={{ attr }}]');
    {% if productAttr[attr].get("innerBy") %}
    {% set inner_by = productAttr[attr]["innerBy"] %}
    this.inner_by = this.$el.find('a[data-type={{ inner_by }}]');
    {% end %}
    this.init()
};
Button_{{ attr }}.prototype = {
    constructor: Button_{{ attr }},
    init: function(e){
        this.${{ attr }}.on('click', $.proxy(this.apply{{ attr }}, this));
        console.log("attr===", {{ attr }})
    },
    apply{{ attr }}: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var ${{ attr }} = $target.parent().siblings().children();
        if ($target.hasClass('active')) {
            return;
        }
        ${{ attr }}.removeClass('active');
        $target.addClass('active');
        this.selected_{{ attr }} = $target.data('value');
        console.log("value==button==");
        // this.changeMemoryRange(range);
        {% if productAttr[attr].get("innerAttrValueList", "") %}
            this.changeMemoryLine(this.selected_{{ attr }});
        {% end %}
        {#this.getCloudPrice(true);#}
    },
    changeMemoryLine: function(inner){
        var memory_line = this.inner_by.parents(".btn-group-justified");
        var inner_value = memory_line.not(".hidden").data("inner");
        if(inner === inner_value){
            return;
        }
        memory_line.not(".hidden").addClass("hidden");
        memory_line.filter("[data-inner="+ inner +"]").removeClass("hidden");
    }
};