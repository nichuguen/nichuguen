"use strict";

Vue.component('artist', {
    template: `<tr>
                <td><button v-on:click="$emit(\'remove\')" class="pure-button">X</button></td>
        <td>{{artistname}}</td>
    </tr>`,
    props: ['artistname'],
    data: () => ({
    }),
    methods: {}
})
