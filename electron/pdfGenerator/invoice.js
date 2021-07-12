import fs from 'fs'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

/**
 * createRow - Creates row definition.
 *
 * @param {string} left left row content
 * @param {string} right right row content
 * @param {object} leftOptions left element options
 * @param {object} rightOptions right element options
 * @returns {Array} row defition
 */
function createRow(left, right, leftOptions = {}, rightOptions = {}) {
  return [
    { text: left, alignment: 'left', margin: [0, 8, 0, 0], ...leftOptions },
    { text: right, alignment: 'right', margin: [0, 8, 0, 0], ...rightOptions },
  ]
}

/**
 * createInvoice - Creates PDFMake doc definition from data.
 *
 * @param {string} title invoice title
 * @param {string} subtitle invoice subtitle
 * @param {*} data invoice rows
 * @returns {object} document definition
 */
function createInvoice(title, subtitle, ...data) {
  const rows = data.map(entry => createRow(...entry))
  return {
    content: [
      {
        text: title,
        alignment: 'center',
        fontSize: 25,
      },

      {
        table: {
          widths: ['*', 'auto'],
          heights: 30,
          alignments: ['left', 'right'],
          body: [
            [
              {
                text: subtitle,
                alignment: 'center',
                fontSize: 15,
                margin: [0, 3, 0, 0],
                colSpan: 2,
              },
              '',
            ],
            ...rows,
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ],
  }
}

/**
 * saveInvoice - Saves specified invoice to a `path`.
 *
 * @param {string} path save path
 * @param {string} title invoice title
 * @param {string} subtitle invoice subtitle
 * @param {*} invoiceData invoice rows
 * @returns {Promise} completion promise
 */
export default function saveInvoice(path, title, subtitle, ...invoiceData) {
  return new Promise((resolve, reject) => {
    try {
      const docDefinition = createInvoice(title, subtitle, ...invoiceData)
      pdfMake.createPdf(docDefinition).getBuffer(buffer => {
        try {
          fs.writeFileSync(path, buffer)
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}
