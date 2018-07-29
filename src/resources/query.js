export default {
    rootQuery : `query rootQuery{
        shop {
          name
          collections (first:10){
            edges {
              node {
                id
                handle
                title
                description
                image{
                  src
                }
              }
            }
          }
        }
    }`,
    productsByCollection : title => `query{
        shop {
            collections (first: 1, query: "title:'${title}'"){
                edges {
                    node {
                        products(first:100){
                            edges{
                                node{    
                                    id
                                    handle
                                    title
                                    tags
                                    onlineStoreUrl
                                    options (first:3){
                                        id
                                        name
                                        values
                                    }
                                    collections (first:100){
                                        edges{
                                            node{
                                                id
                                                handle
                                                title
                                            }
                                        }
                                    }
                                    description
                                    descriptionHtml
                                    images (first:50){
                                        edges{
                                            node{
                                                altText
                                                src
                                            }
                                        }
                                    }
                                    variants (first: 100){
                                        edges{
                                            node{
                                                id
                                                product{
                                                    id
                                                    handle
                                                }
                                                selectedOptions{
                                                    name
                                                    value
                                                }
                                                title
                                                available
                                                compareAtPrice
                                                price
                                                image{
                                                    src
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }`,
    productById : `query productById($id : ID!){
        node(id : $id){
            ... on Product{
                id
                handle
                title
                tags
                onlineStoreUrl
                options (first:3){
                    id
                    name
                    values
                }
                collections (first:100){
                    edges{
                        node{
                            id
                            handle
                            title
                        }
                    }
                }
                description
                descriptionHtml
                images (first:50){
                    edges{
                        node{
                            altText
                            src
                        }
                    }
                }
                variants (first: 100){
                    edges{
                        node{
                            id
                            product{
                                id
                                handle
                            }
                            selectedOptions{
                                name
                                value
                            }
                            title
                            available
                            compareAtPrice
                            price
                            image{
                                src
                            }
                        }
                    }
                }
            }
        }
    }`,
    productQuery : `query productQuery{
        shop {
            products (first:100){
                edges{
                    node{
                        id
                        handle
                        title
                        tags
                        options (first:3){
                            id
                            name
                            values
                        }
                        collections (first:100){
                            edges{
                                node{
                                    id
                                    handle
                                    title
                                }
                            }
                        }
                        images (first:100){
                            edges{
                                node{
                                    altText
                                    src
                                }
                            }
                        }
                        variants (first: 20){
                            edges{
                                node{
                                    id
                                    title
                                    available
                                    compareAtPrice
                                    price
                                    selectedOptions{
                                        name
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }`,
    getVariant : `query getVariant($prodID: ID!){
        node(id : $prodID){
            ... on Product{
                variants (first: 100){
                    edges{
                        node{
                            id
                            product{
                                id
                                handle
                            }
                            selectedOptions{
                                name
                                value
                            }
                            title
                            available
                            compareAtPrice
                            price
                            image{
                                src
                            }
                        }
                    }
                }
            }
        }
    }`,
    getCart : `query GetCart($cartID: ID!){
        node(id : $cartID){
            id
            ... on Checkout 
            {
                webUrl
                subtotalPrice
                totalPrice
                completedAt
                lineItems(first: 5) {
                edges {
                    node {
                        title
                        id
                        quantity
                        variant{
                            id
                            title
                        }
                    }
                }
                }
            }
        }
    }`,
    createCart : `mutation ($variant: ID!, $quantity: Int!) {
        checkoutCreate(input: {
          lineItems: [{ variantId: $variant, quantity: $quantity }]
        }) {
          checkout {
            id
            webUrl
            subtotalPrice
            totalPrice
            lineItems(first: 5) {
              edges {
                node {
                  title
                  id
                  quantity
                  variant{
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }`,
    addToCart : `mutation ($variant: ID!, $quantity: Int!, $checkout: ID!) {
        checkoutLineItemsAdd(lineItems: [{ variantId: $variant, quantity: $quantity }], checkoutId: $checkout)
        {
            checkout {
                id
                webUrl
                subtotalPrice
                totalPrice
                lineItems(first: 5) {
                    edges {
                        node {
                            title
                            id
                            quantity
                            variant{
                                id
                                title
                            }
                        }
                    }
                }
            }
        }
    }`,
    removeFromCart : `mutation ($lineItemIds: [ID!]!, $checkout: ID!) {
        checkoutLineItemsRemove(lineItemIds:$lineItemIds, checkoutId: $checkout)
        {
            userErrors {
                field
                message
            }
            checkout {
                id
                webUrl
                subtotalPrice
                totalPrice
                lineItems(first: 100) {
                    edges {
                        node {
                            title
                            id
                            quantity
                            variant{
                                id
                                title
                            }
                        }
                    }
                }
            }
        }
    }`,
    createCustomerToken : `mutation ($email: String!, $pw: String!) {
        customerAccessTokenCreate(input : {
            email: $email,
            password: $pw
        }){
            userErrors {
                field
                message
              }
              customerAccessToken {
                accessToken
                expiresAt
              }
        }
    }`,
    getCustomer : `query ($token: String!) {
        customer(customerAccessToken : $token){
            id
            displayName
            email
            firstName
            lastName
        }
    }`,
    associateCheckout : `mutation checkoutCustomerAssociate($checkoutId: ID!, $customerAccessToken: String!) {
        checkoutCustomerAssociate(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
          userErrors {
            field
            message
          }
          checkout {
            id
            webUrl
            subtotalPrice
            totalPrice
            lineItems(first: 5) {
                edges {
                    node {
                        title
                        id
                        quantity
                        variant{
                            id
                            title
                        }
                    }
                }
            }
          }
        }
    }`
}