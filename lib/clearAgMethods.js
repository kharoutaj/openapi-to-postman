/**
 * Set of methods used to parse API responses and store in Postman Varaibles
 * These are used in the conversion from OAS3 spec to Postman collection
 * They are read from OAS3 extensions under postman_config/parse_func
 * E.g:
 * postman_config{var_name:xxx, parse_func:yyy}
 */
 module.exports = {

    /**
     * Generates the postman test script using the variable name and function name parameters
     *
     * @param {string} var_name - name of postman variable to write 
     * @param {string} func_name - name of postman script to use
     * @returns {object} post_script - json blob of the postman test script
    */
     getPostScript: function(var_name, func_name) {
        let retVal = this.postScripts[func_name]
        if (var_name) {
            retVal.script.exec.forEach(function(element, index) {
                this[index] = element.replace(/{x}/g, var_name)
            }, retVal.script.exec);
        }
        return retVal
     },
     postScripts: {
        http_200: {
            listen:'test',
            script:{
                "exec": [
                    "pm.test(\"Status code is 200\", function () {",
                        "pm.response.to.have.status(200);", 
                        "});"
                ],
                "type": "text/javascript"
            }
        },
        resp_text: { 
            listen:'test',
            script:{
                "exec": [
                    "pm.test(\"Status code is 200\", function () {",
                        "pm.response.to.have.status(200);", 
                        'pm.environment.set(\"{x}\", pm.response.text());',
                        "});"
                ],
                "type": "text/javascript"
            }
        },
        parse_zones: { 
            listen:'test',
            script:{
                "exec": [
                    "var geoj = pm.response.json();",
                    "pm.test(\"Status code is 200\", function () {",
                        "pm.response.to.have.status(200);", 
                        "for(i=1; i<=35; i++){",
                            "pm.environment.unset(\"{x}\"+i);",
                        "}",
                        "for(i=0; i<geoj.features.length; i++){",
                            "pm.environment.set(\"{x}\"+(i+1), geoj.features[i].id);",
                        "}",
                        "});"
                ],
                "type": "text/javascript"
            }
        }
    },
 }