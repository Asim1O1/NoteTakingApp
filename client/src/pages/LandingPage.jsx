import React, { useState } from 'react';
import { ChevronDown, Star, MessageCircle, Phone, NotebookPen, Zap, Shield, Users, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "How secure are my notes?",
            answer: "Your notes are encrypted end-to-end and stored securely in the cloud. We use military-grade encryption to ensure your data remains private and accessible only to you."
        },
        {
            question: "Can I access my notes offline?",
            answer: "Yes! Our app works offline and automatically syncs your notes when you're back online. You'll never lose your thoughts, even without an internet connection."
        },
        {
            question: "Is there a limit to how many notes I can create?",
            answer: "The free plan includes up to 1,000 notes. Our premium plans offer unlimited notes, advanced organization features, and priority support."
        },
        {
            question: "Can I share notes with others?",
            answer: "Absolutely! You can share individual notes or entire notebooks with team members, friends, or family. Control permissions to allow viewing or editing access."
        },
        {
            question: "What devices are supported?",
            answer: "Our app works on all major platforms including iOS, Android, Windows, Mac, and through any web browser. Your notes sync seamlessly across all devices."
        }
    ];

    const reviews = [
        {
            name: "Sarah Chen",
            role: "Product Manager",
            content: "This app completely transformed how I organize my thoughts. The search functionality is incredibly fast and the interface is so intuitive.",
            rating: 5,
            avatar: "SC"
        },
        {
            name: "Marcus Rodriguez",
            role: "Student",
            content: "Perfect for taking lecture notes and organizing research. The tagging system helps me find everything instantly. Couldn't imagine studying without it!",
            rating: 5,
            avatar: "MR"
        },
        {
            name: "Emily Foster",
            role: "Writer",
            content: "As a freelance writer, I need to capture ideas quickly. This app's speed and reliability are unmatched. The markdown support is a game-changer.",
            rating: 5,
            avatar: "EF"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-600/20 animate-pulse"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    <div className="text-center">
                        <div className="mb-8 animate-bounce">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full shadow-2xl">
                                <NotebookPen className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                            Your Ideas,
                            <span className="bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent"> Organized</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Capture, organize, and find your thoughts instantly with the most intuitive note-taking app.
                            Your digital brain that never forgets.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Link to="/login" className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                                Start Taking Notes Free
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-8 text-gray-400">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                <span>End-to-end encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                <span>Lightning fast</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>500k+ users</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="py-20 bg-black/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Loved by <span className="text-gray-400">Millions</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Join thousands of satisfied users who've transformed their productivity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-gray-500/50 transition-all duration-300 transform hover:scale-105">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-gray-300 fill-current" />
                                    ))}
                                </div>

                                <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                                    "{review.content}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">{review.name}</div>
                                        <div className="text-gray-400">{review.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Frequently Asked <span className="text-gray-400">Questions</span>
                        </h2>
                        <p className="text-xl text-gray-300">
                            Everything you need to know about our note-taking app
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-gray-500/50 transition-all duration-300">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 rounded-2xl transition-all duration-300"
                                >
                                    <span className="text-white font-semibold text-lg">{faq.question}</span>
                                    <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>

                                {openFaq === index && (
                                    <div className="px-8 pb-6 animate-fade-in">
                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Support Section */}
            <div className="py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Need <span className="text-gray-400">Support?</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Our dedicated support team is here to help you every step of the way
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-gray-500/50 transition-all duration-300 transform hover:scale-105 text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4">Live Chat</h3>
                            <p className="text-gray-300 mb-6">Get instant help with our 24/7 live chat support</p>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
                                Start Chat
                            </button>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-gray-500/50 transition-all duration-300 transform hover:scale-105 text-center md:col-span-2 lg:col-span-1">
                            <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Phone className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4">Phone Support</h3>
                            <p className="text-gray-300 mb-6">Call us directly for urgent issues and premium support</p>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
                                Call Now
                            </button>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Alert className="bg-white/10 border-gray-500/50 max-w-2xl mx-auto">
                            <CheckCircle className="h-4 w-4 text-white" />
                            <AlertDescription className="text-white">
                                <strong>Pro tip:</strong> Check out our comprehensive help center with tutorials, guides, and troubleshooting tips before contacting support.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-20 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Get <span className="text-gray-400">Organized?</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join millions of users who've already transformed their productivity
                    </p>
                    <button className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                        Start Your Free Trial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;