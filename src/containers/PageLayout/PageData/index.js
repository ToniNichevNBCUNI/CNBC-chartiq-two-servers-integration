export default {
  '/about' : {
      layout: [ 
        {
          span: 12,
          components: [
            {
              name: "Header"
            }
          ]
        },
        {
          span: 12,
          components:[
            {
              name: "About"
            }
          ] 
        }         
      ]    
  },
  '/home' : {
      layout: [ 
        {
          span: 12,
          components: [
            {
              name: "Header"
            }
          ]
        },
        {
          span: 12,
          components:[
            {
              name: "Home"
            }
          ] 
        },        
      ]
  },
  '/greetings' : {
      layout: [ 
        {
          span: 12,
          components: [
            {
              name: "Header"
            }
          ]
        },
        {
          span: 12,
          components:[
            {
              name: "Greetings"
            }
          ] 
        },        
      ]
  },
  '/chart' : {
      layout: [ 
        {
          span: 12,
          components: [
            {
              name: "Header"
            }
          ]
        },
        {
          span: 12,
          components:[
            {
              name: "ChartPage"
            }
          ] 
        },        
      ]
  }    
}
