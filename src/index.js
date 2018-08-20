import queriedEntityReducer from './queriedEntity/queriedEntityReducer';
import queriedEntity from './queriedEntity/queriedEntity';
import detailedEntityReducer from './detailEntity/detailedEntityReducer';
import detailedEntity from './detailEntity/detailedEntity';
import {queryEntities} from "./queriedEntity/queriedEntityActions";
import {getItem as getDetailedEntity} from "./detailEntity/detailedEntityActions";


export default {queriedEntityReducer, queriedEntity, detailedEntityReducer,
    detailedEntity, queryEntities, getDetailedEntity }


