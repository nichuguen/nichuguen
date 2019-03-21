"use strict";

Vue.component('artist', {
    template: `<tr>
                <td><button v-on:click="$emit(\'remove\')">X</button></td>
        <td>{{artistname}}</td>
    </tr>`,
    props: ['artistname'],
    data: () => ({
    }),
    methods: {}
})
