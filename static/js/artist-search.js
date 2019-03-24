"use strict";

Vue.component('artist-search', {
    template: `
    <div>
        Name: {{artists[selectedId].name}}
        <br/>
        Uri: {{artists[selectedId].uri}}
        <br/>
        Image: {{artists[selectedId].imageUrl}}
        <br/>
        <button v-on:click="$emit(\'remove\')" class="pure-button">X</button>
        <button v-on:click="previous" class="pure-button">&lt;</button>
        <button v-on:click="next" class="pure-button">&gt;</button>
    </div>
    `,
    props: ['artists'],
    data: () => ({
        selectedId: 0,
        selectedImg: "./static/imgs/icon.png",
    }),
    // hacking around vue
    // calling this will update the path for the img
    mounted: function(){
        this.changeSelectedId(0);
    },
    methods: {
        next: function(){
            this.changeSelectedId(1);
            this.$emit('next');
        },
        previous: function(){
            this.changeSelectedId(-1);
            this.$emit('previous');
        },
        changeSelectedId: function(increment) {
            this.selectedId += increment + this.artists.length;
            this.selectedId %= this.artists.length;
            this.selectedImg = this.artists[this.selectedId].imageUrl;
            console.log(this.artists[this.selectedId].name);
        },

    }
})
