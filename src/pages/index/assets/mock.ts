import TemporalTime from 'dayjs';
import { uniqueId, sampleSize, sample } from 'lodash';

type PARAMS = {
    code: number;
    count: number;
    message: string;
    model: any;
}
    
const defaultPARAMS: PARAMS = {
    code: 200,
    count: 30,
    message: 'string',
    model: {
        id: 'id',
        name: 'storename',
        primary_industry_code: 'string',
        secondary_industry_code: 'string',
        brand_code: 'string',
        source_code: 'string',
        business_practice_code: 'string',
        status: 'cluestatus',
        country_code: 'number',
        province_code: 'number',
        city_code: 'number',
        area_code: 'number',
        address: 'string',
        back_area_time: 'ISOdate',
        owner_account: 'string',
        owner_nickname: 'nickname',
        create_time: 'date',
    },
};

const numset = '123456789';
const charset = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz${numset}`;
const storeset = [ '海底捞', '兴泰', '登良', '万象', '侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城侨城' ];
const nameset = [ '小鱼儿', '欣欣', '向荣', '有容', '小明' ];

const mockvalue = (type, index) => {
    switch (type) {
    case 'id':
        return parseInt(uniqueId(`${index + 1}`), 10);
    case 'storename': 
        return `${sample(storeset)}的线索`;
    case 'number':
        return parseInt(sampleSize(numset, parseInt(sample(numset) ?? '1'))?.join(''), 10);
    case 'date': 
        return TemporalTime('2019-01-25').format('YYYY/MM/DD HH:mm');
    case 'ISOdate':
        return TemporalTime('2019-01-25').toISOString();
    case 'nickname':
        return sample(nameset);
    default:
        return sampleSize(charset, parseInt(sample(numset) ?? '2')).toString().replace(/,/g, '');
    }
};

export default async function (params: Partial<PARAMS> = {}, query?: any, timeout: number = 1000) {
    const { code, message, model, count } = Object.assign({}, params, defaultPARAMS);

    const $model = Object.entries(model);

    const offset = query?.offset ?? 0;
    const limit = query?.limit ?? count - offset;
    
    const list = Array.from({length: count}, (_, index) => {
        const item: any = {};
        $model.forEach(([ key, type ]) => { item[key] = mockvalue(type, index); });
        return item;
    }).slice(offset, (offset + limit));

    const response = { code, message, data: { list, count } };

    return new Promise(res => { setTimeout(() => { res(response); }, timeout); });
}