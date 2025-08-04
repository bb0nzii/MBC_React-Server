// import React from 'react';

// const Footer = () => {
//     return(
//         <>
//         <footer>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="col-md-12">
//                         copyright &copy; 2025 all rights reserved.
//                     </div>
//                 </div>
//             </div>
//         </footer>
//         </>
//     );
// }

// export default Footer;

import React from 'react';
import {Component} from "react";


class Footer extends Component {
    render(){
 return(
<>
<footer>
    <div className="container-fluid ">
        <div className="row">
            <div className="col-md-12 py-3 text-center">
copyright &copy; 2025 all rights reserved.                
            </div>
        </div>
    </div>
</footer>        
</>
    );
    }
   
}
export default Footer;