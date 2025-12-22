import React from 'react';

const NewsletterForm: React.FC = () => {
  return (
    <section className="font-mono text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl leading-tight mb-8">
          BE THE FIRST TO RECEIVE THE<br />
          PASSWORD WHEN 'SPARKTIZEN' DROPS
        </h2>
        <form className="flex flex-col items-center">
          <div className="w-full max-w-sm mb-6">
            <input
              type="email"
              placeholder="EMAIL"
              className="w-full bg-black border-2 border-white rounded-lg px-4 py-3 text-center text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="submit"
            className="bg-white text-black font-bold py-3 px-12 rounded-full hover:bg-gray-200 transition-colors"
          >
            SEND
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterForm;
