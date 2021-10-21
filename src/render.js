const FS = require('fs')
const PATH = require('path')
const { Renderer } = require('xlsx-renderer')

/**
 * Render data into a human readable format or file.
 * @param {String|Function} template for rendering data into a string
 * @param {Boolean|Number|String|Object} data object or path to a file
 * @returns {String|Object} rendered data
 */
async function render(template, data) {

    let result = undefined
    let loaded = undefined

    // load data
    switch (true) {
        case typeof data === 'boolean':
        case typeof data === 'number':
        case typeof data === 'object':
            loaded = data
            break

        case typeof data === 'string' && /\.json\b/i.test(data):
            const dataFile = PATH.resolve(data)
            if (!FS.existsSync(dataFile))
                throw new Error(`${dataFile} doesn't exists.`)
            loaded = require(dataFile)
            break

        case typeof data === 'string':
            loaded = JSON.parse(data)
            break

        default:
            throw new Error(`cannot load ${data}`)
    }

    // render template
    switch (true) {
        case typeof template === 'function':
            result = template(loaded)
            break

        case typeof template === 'string':
            const tempFile = PATH.resolve(template)
            if (!FS.existsSync(tempFile))
                throw new Error(`${tempFile} doesn't exists.`)
            if (PATH.extname(tempFile) !== '.js' && PATH.extname(tempFile) !== '.xlsx') {
                throw new Error(`cannot render template ${tempFile}`)
            }
            let renderer = undefined
            if (PATH.extname(tempFile) === '.js') {
                renderer = require(tempFile)
                result = render(renderer, loaded)
            } else {
                renderer = new Renderer
                result = await renderer.renderFromFile(tempFile, loaded)
            }
            break

        default:
            throw new Error(`cannot render template ${template}`)

    }

    return result

}

module.exports = { render }