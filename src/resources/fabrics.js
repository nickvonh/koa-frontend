import brushed from '@/assets/images/fabrics/brushed-fleece.png'
import thick from '@/assets/images/fabrics/thick-scuba.png'
import light from '@/assets/images/fabrics/light-scuba.png'
import ultra from '@/assets/images/fabrics/ultralite.png'
import perforated from '@/assets/images/fabrics/perforated.png'

import brushedIcon from '@/assets/brushed.svg'
import insulate from '@/assets/insulate.svg'
import lite from '@/assets/lite.svg'
import dry from '@/assets/dry.svg'
import perforatedIcon from '@/assets/perforated.svg'
export default {
    
    fabrics : [
        {
            name : 'Brushed Fleece',
            image: brushed,
            details: {
                weight : 'medium',
                touch : 'ultra soft',
                traits : [
                    {
                        display: 'brushed lining',
                        icon : brushedIcon
                    },
                    {
                        display: 'rapid drying',
                        icon: dry
                    }
                ],
                tagLine : 'Lined with ultra light fleece, our brushed fabric is perfectly soft and cozy for all occasions'
            }
        },
        {
            name : 'Heavy Scuba',
            image: thick,
            details: {
                weight : 'heavy',
                touch : 'soft and smooth',
                traits : [
                    {
                        display : 'insulating shell',
                        icon : insulate
                    }
                ],
                tagLine : 'With a smooth sheen finish, our heavy stretch scuba makes for a chic and structured outer layer'
            }
        },
        {
            name : 'Light Scuba',
            image: light,
            details: {
                weight : 'light',
                touch : 'smooth and slick',
                traits : [
                    {
                        display : 'insulating shell',
                        icon : insulate
                    },
                    {
                        display : 'structured draping'
                    }
                ],
                tagLine : 'With just the right amount of compression, our light stretch scuba makes the perfect insulating shell that allows for movement'
            }
        },
        {
            name : 'Slick Poly',
            image: ultra,
            details: {
                weight : 'ultra light',
                touch : 'slick semi-sheer',
                traits : [
                    {
                        display: 'light and breezy',
                        icon : lite
                    },
                    {
                        display: 'rapid drying',
                        icon: dry
                    }
                ],
                tagLine : 'Rapid drying and moisture wicking, our slick poly will keep you cool through any sweaty situation'
            }
        },
        {
            name : 'Knit Poly',
            image: perforated,
            details: {
                weight : 'light',
                touch : 'super slick stretch',
                traits : [
                    {
                        display: 'laser perforated',
                        icon: perforatedIcon
                    },
                    {
                        display: 'rapid drying',
                        icon: dry
                    },
                    {
                        display: 'light and breezy',
                        icon : lite
                    }
                ],
                tagLine : 'Smooth and airy, our knit poly will keep you cool through any sweaty situation. Plus, ventilate in style with the laser cut box-out details'
            }
        }
    ]
}