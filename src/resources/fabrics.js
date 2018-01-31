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
                        display: 'brushed inner lining',
                        icon : brushedIcon
                    },
                    {
                        display: 'rapid drying',
                        icon: dry
                    }
                ],
                tagLine : 'Ultra soft brushed fabric made to feel <em>amazing</em> on your skin'
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
                tagLine : 'Heavy stretch scuba, for a warm structured outer layer.'
            }
        },
        {
            name : 'Light Scuba',
            image: light,
            details: {
                weight : 'light',
                touch : 'dense and slick',
                traits : [
                    {
                        display : 'insulating shell',
                        icon : insulate
                    },
                    {
                        display : 'structured draping'
                    }
                ],
                tagLine : 'Lightweight insulating shell, perfect for a windy day.'
            }
        },
        {
            name : 'Ultralite',
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
                tagLine : 'This fabric is incredibly light weight and dries in an instant'
            }
        },
        {
            name : 'Perforated',
            image: perforated,
            details: {
                weight : 'light',
                touch : 'super slick stretch',
                traits : [
                    {
                        display: 'laser perforated patterns',
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
                tagLine : 'Ventilate in style, with our laser perforated stretch blend'
            }
        }
    ]
}