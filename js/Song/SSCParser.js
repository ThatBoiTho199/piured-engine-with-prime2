/*
 * # Copyright (C) Pedro G. Bascoy
 # This file is part of piured-engine <https://github.com/piulin/piured-engine>.
 #
 # piured-engine is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # piured-engine is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with piured-engine.If not, see <http://www.gnu.org/licenses/>.
 *
 */
"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


var commentRegex = new RegExp(/\/\/.*(\n|\r|\r\n|$)/g) ;
var emptyLineRegex = new RegExp(/\s*(\n|\r|\r\n|$)/g);

function parseSSCSection(SSCContentBySentences, startPosition, stopCondition, parseValue) {

    var meta = {} ;


    for (var i = startPosition; i < SSCContentBySentences.length; i++) {
        let sentence = SSCContentBySentences[i];

        let tagValue = sentence.split(':');


        let tag = tagValue[0].replace(commentRegex, '')
            .replace(/\s*#/, '');

        // early stop if stopCondition met, or we reached the end of the file
        if  (stopCondition (tag)) {
            return postProcessing( meta , i ) ;
        } else if (/^(\n|\r|\r\n)$/.exec(tag) != null ) {
            return postProcessing( meta , SSCContentBySentences.length ) ;
        }




        // console.log(tagValue) ;

        if (tag!=='') {
            let value = parseValue(tag, tagValue[1]) ;

            meta[tag] = value ;
        }




    }

    return postProcessing( meta, SSCContentBySentences.length ) ;

}

// This function is called once the stopCondition is met or we arrive to the end of the file.
// In this fuction we postprocess some values of of the metadata.
function postProcessing(meta, endIndex) {

    if ( 'BPMS' in meta ) {
        meta['BPMS'] = parseCommaSeparatedAssignments( meta['BPMS'] ) ;
    }

    if ( 'TICKCOUNTS' in meta ) {
        meta['TICKCOUNTS'] = parseCommaSeparatedAssignments( meta['TICKCOUNTS'] ) ;
    }

    if ( 'SCROLLS' in meta ) {
        meta['SCROLLS'] = parseCommaSeparatedAssignments( meta['SCROLLS'] ) ;
    }

    if ( 'OFFSET' in meta ) {
        meta['OFFSET'] = parseFloat(meta['OFFSET']) ;
    }

    if ( 'SPEEDS' in meta ) {
        meta['SPEEDS'] = parseCommaSeparatedAssignments(meta['SPEEDS']) ;
    }

    if ( 'STOPS' in meta ) {
        meta['STOPS'] = parseCommaSeparatedAssignments(meta['STOPS']) ;
    }

    if ( 'WARPS' in meta ) {
        meta['WARPS'] = parseCommaSeparatedAssignments(meta['WARPS']) ;
    }

    if ( 'DELAYS' in meta ) {
        meta['DELAYS'] = parseCommaSeparatedAssignments(meta['DELAYS']) ;
    }


    return [ meta, endIndex ] ;
}

function parseCommaSeparatedAssignments(content) {
    let list = [] ;
    let commaSplit = content.split(',') ;
    for (var i = 0 ; i < commaSplit.length ; ++i ) {
        // [0] -> beat
        // [1] -> value
        let aux = [] ;
        let equalSplit = commaSplit[i].split('=') ;
        for (let val of equalSplit) {
            aux.push( parseFloat(val) ) ;
        }
        list.push(aux) ;
    }
    return list ;
}

//stop condition for finding notedata sections.
var noteDataSectionCondition = function (tag) {
    return tag === 'NOTEDATA';
} ;

var parseValueMeta = function (tag, value) {
    // console.log(tag);
    return value.replace(commentRegex, '')
        // remove empty lines
        .replace(emptyLineRegex, '')
        // remove # symbol.
        .replace(/\s*#/, '')
        // remove semicolon.
        .replace(/;\s*/, '');
}

var parseValueNotes = function (tag, value) {
    if (tag === 'NOTES') {
        return value.replace(commentRegex, '')
            // remove # symbol.
            .replace(/\s*#/, '')
            // remove semicolon.
            .replace(/;\s*/, '');
    } else {
        return parseValueMeta( tag, value ) ;
    }
}