import {formatDate} from '../misc'

test('formatDate formats the date to look nice',()=>{
    expect(formatDate(new Date('Febuary 04, 2000'))).toBe('Feb 00')
})

