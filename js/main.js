var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText" />
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                
                <p v-if="inStock">In Stock</p>
                <p v-else :class="{ outOfStock: !inStock }">Out of stock</p>
                
                <p>Shipping: {{ shipping }}</p>


                <ul>
                    <li v-for="detail in details">
                        {{detail}}
                    </li>
                </ul>
                
                <div 
                class="color-box"
                v-for="(variant, index) in variants" 
                :key="variant.variantId"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)"
                >
            </div>
            
           
            <button @click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
            >Add to cart
            </button>
        
            </div>

            <product-tabs :reviews="reviews"></product-tabs>

    </div>

    `,
    data() {
        return {
            product: 'Socks',
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "#2a935b",
                    variantImage: "./images/socks-green.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "#435672",
                    variantImage: "./images/socks-blue.png",
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    } ,
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            return (this.premium) ? "Free" : 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
          this.reviews.push(productReview)
        })
    }
})


Vue.component('product-review', {
    template: `
       <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
            
       <p>
           <label for="name">Name:</label>
           <input id="name" v-model="name" placeholder="name" >
       </p>
   
       <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review"></textarea>
       </p>
   
       <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
           <option>5</option>
           <option>4</option>
           <option>3</option>
           <option>2</option>
           <option>1</option>
       </select>
       </p>
   
       <p>
       <input type="submit" value="Submit">
       </p>
       </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
       onSubmit() {
            this.errors = []
           if(this.name && this.review && this.rating){
               let productReview = {
                   name: this.name,
                   review: this.review,
                   rating: this.rating
               }
               eventBus.$emit('review-submitted', productReview)
               this.name = null
               this.review = null
               this.rating = null
           }else{
               if(!this.name) this.errors.push("Name required.")
               if(!this.review) this.errors.push("Review required.")
               if(!this.rating) this.errors.push("Rating required.")
           }
   
       }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
          type: Array,
          required: false
        }
    },
    template: `
    <div class="tabs-section">
          
    <ul class="ul-section">
        <span class="tabs" 
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs"
            @click="selectedTab = tab"
            :key="tab"
        >{{ tab }}</span>
    </ul>
    
    <div v-show="selectedTab === 'Reviews'" class="reviews-section">
        <p v-if="!reviews.length" class="no-review">There are no reviews yet.</p>
        <ul v-else>
            <li v-for="(review, index) in reviews" :key="index">
              <p class="review-name">{{ review.name }}</p>
              <p class="review-rating">
                <span v-for="n in review.rating"> <i class="fa fa-star icon-rating"></i> </span>
              </p>
              <p class="review-message">{{ review.review }}</p>
            </li>
        </ul>
    </div>

    <div v-show="selectedTab === 'Make a Review'" class="form-review-section">
        <product-review></product-review>
    </div>
    
  </div>
    `,
    data() {
      return {
        tabs: ['Reviews', 'Make a Review'],
        selectedTab: 'Reviews'
      }
    }
  })

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})