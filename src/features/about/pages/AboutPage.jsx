import { Link } from 'react-router-dom';
import Footer from '@shared/components/Footer';
import { Button } from '@shared/components/ui/Button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@shared/components/ui/Breadcrumb';
import { Mail, Phone, PawPrint } from 'lucide-react';

import aboutusbg from '@shared/assets/aboutusbg.jpg';


export default function AboutPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Carlos Rogel Lofranco",
      email: "carlos@zootopia.com",
      phone: "313-1187-101",
      image: null,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      

      <main className="flex-1">
   
        <section className="bg-gradient-to-r from-red-600/10 to-red-500/5 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">About Us</h1>
            <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">Get to know the team behind Zootopia</p>

            <div className="mt-6">
              <Breadcrumb className="justify-center">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/about" className="font-medium">
                      About Us
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </section>

 
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={aboutusbg}
                  alt="Puppy and kitten"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    At Zootopia, pets are family. Our mission is to provide top-quality products that make caring for
                    your pets simple and joyful.
                  </p>
                  <p>
                    From healthy food to toys and grooming essentials, we've got everything to keep your furry,
                    feathered, or scaly friends happy.
                  </p>
                  <p>
                    We believe that every pet deserves the best care possible, and we're committed to helping pet
                    parents provide that care through quality products, expert advice, and exceptional service.
                  </p>
                </div>
                <Button className="rounded-full bg-red-600 hover:bg-red-700" asChild>
                  <Link to="/services">Explore Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

   
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                The passionate person behind Zootopia who works tirelessly to ensure your pets get the best
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-8 max-w-md mx-auto">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <PawPrint className="h-20 w-20 text-red-300 mx-auto mb-2" />
                        <span className="text-gray-400 text-sm">No Image Available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-xl mb-2">{member.name}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${member.email}`} className="hover:text-red-600">
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${member.phone}`} className="hover:text-red-600">
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

   
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                The principles that guide everything we do at Zootopia
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-red-50 p-8 rounded-xl">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <PawPrint className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-center">Quality</h3>
                <p className="text-gray-600 text-center">
                  We carefully select only the highest quality products that we would use for our own pets.
                </p>
              </div>

              <div className="bg-red-50 p-8 rounded-xl">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <PawPrint className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-center">Care</h3>
                <p className="text-gray-600 text-center">
                  We treat every pet as if they were our own, with compassion, respect, and genuine care.
                </p>
              </div>

              <div className="bg-red-50 p-8 rounded-xl">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <PawPrint className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-center">Community</h3>
                <p className="text-gray-600 text-center">
                  We're committed to building a community of pet lovers who share our passion for animal welfare.
                </p>
              </div>
            </div>
          </div>
        </section>

 
        
      </main>

      <Footer />
    </div>
  );
}