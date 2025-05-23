import React from 'react';
{/* Warning Change the footer before the end of the project */}
const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Learning Management System. All rights reserved.</p>
            <p>Follow us on:</p>
            <div className="flex justify-center space-x-4 mt-2">
                {/*isko change kr lena */}
            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
            </div>
        </div>
        </footer>
    );
}

export default Footer;