from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ContactSubmission, Service, Project
import json

def get_or_create_default_data():
    # Check if services exist, if not, create them
    if Service.objects.count() == 0:
        services_list = [
            # SEO
            {"name": "Search Engine Optimization (SEO)", "category": "SEO", "icon": "ri-line-chart-line", "description": "Rank #1 on Google with data-driven on-page, off-page, and keyword strategies that drive high-intent organic traffic."},
            {"name": "Local SEO", "category": "SEO", "icon": "ri-map-pin-line", "description": "Optimize your local footprint to dominate local search queries and attract customers in your physical vicinity."},
            {"name": "Technical SEO", "category": "SEO", "icon": "ri-cpu-line", "description": "Improve your site speed, crawlability, indexation, and core web vitals to satisfy search engine algorithms."},
            
            # Social Media & Ads
            {"name": "Social Media Marketing", "category": "Marketing", "icon": "ri-share-forward-line", "description": "Build an active, engaging community and expand your organic reach across key social networks."},
            {"name": "Facebook Ads", "category": "Marketing", "icon": "ri-facebook-fill", "description": "High-ROAS paid campaign scaling through advanced pixel tracking and lookalike audience segmentation."},
            {"name": "Instagram Ads", "category": "Marketing", "icon": "ri-instagram-line", "description": "Visually stunning creatives and stories campaigns designed to capture immediate attention and conversions."},
            {"name": "Google Ads (PPC)", "category": "Marketing", "icon": "ri-google-fill", "description": "Target buyers directly at the moment of search intent to guarantee high conversion rates and measurable ROI."},
            {"name": "YouTube Marketing", "category": "Marketing", "icon": "ri-youtube-line", "description": "Create, optimize, and distribute engaging video content and video ads to drive brand awareness and engagement."},
            {"name": "Email Marketing", "category": "Marketing", "icon": "ri-mail-send-line", "description": "Automated email sequences, newsletters, and lifecycle marketing that nurture leads and maximize customer LTV."},
            {"name": "WhatsApp Marketing", "category": "Marketing", "icon": "ri-whatsapp-line", "description": "Direct, conversational marketing pipelines yielding up to 98% open rates and instant customer engagement."},
            {"name": "Content Marketing", "category": "Marketing", "icon": "ri-article-line", "description": "Authoritative blogs, whitepapers, and guides that establish your brand as a trusted industry leader."},
            {"name": "Influencer Marketing", "category": "Marketing", "icon": "ri-user-star-line", "description": "Leverage authentic partnerships with niche creators to dramatically amplify brand credibility and reach."},
            
            # Design & Branding
            {"name": "Branding", "category": "Design", "icon": "ri-pantone-line", "description": "Craft a memorable identity, brand guidelines, and visual language that sets you apart from competitors."},
            {"name": "Logo Design", "category": "Design", "icon": "ri-pencil-ruler-line", "description": "Sleek, timeless, and vector-perfect custom logos representing your core brand values at a glance."},
            {"name": "UI/UX Design", "category": "Design", "icon": "ri-palette-line", "description": "Interactive wireframes and high-fidelity screen designs focused on user engagement and conversion optimization."},
            
            # Development
            {"name": "Website Development", "category": "Development", "icon": "ri-global-line", "description": "Ultra-fast, responsive, and secure custom websites tailored specifically to your business goals."},
            {"name": "Landing Page Development", "category": "Development", "icon": "ri-pages-line", "description": "Hyper-focused, single-page sites built specifically for high conversions on paid traffic campaigns."},
            {"name": "E-Commerce Development", "category": "Development", "icon": "ri-shopping-bag-3-line", "description": "Scalable online stores with seamless payment checkouts, advanced inventory management, and fast loads."},
            {"name": "Custom CRM Development", "category": "Development", "icon": "ri-database-2-line", "description": "Bespoke database solutions to streamline internal sales processes, tracking, and customer management."},
            {"name": "Web Application Development", "category": "Development", "icon": "ri-code-s-slash-line", "description": "Sophisticated, interactive software interfaces built on robust frameworks like Python/Django."},
            {"name": "Mobile App Development", "category": "Development", "icon": "ri-smartphone-line", "description": "Native-grade cross-platform apps for iOS and Android built to engage users on the go."},
            
            # AI & Analytics
            {"name": "AI Automation", "category": "Automation", "icon": "ri-magic-line", "description": "Integrate artificial intelligence, chatbots, and auto-pipelines to slash operating overhead and save time."},
            {"name": "Marketing Analytics", "category": "Automation", "icon": "ri-pie-chart-line", "description": "Advanced tracking, attribution modeling, and automated performance dashboards for clear insights."},
            {"name": "Conversion Rate Optimization", "category": "Automation", "icon": "ri-percent-line", "description": "Rigorous A/B testing and user heatmaps to maximize the value of your existing site traffic."},
            {"name": "Lead Generation", "category": "Automation", "icon": "ri-user-add-line", "description": "Multi-channel pipelines combining forms, lead magnets, and funnels to deliver highly qualified sales calls."}
        ]
        for s in services_list:
            Service.objects.create(
                name=s["name"],
                category=s["category"],
                description=s["description"],
                icon=s["icon"],
                is_featured=True
            )

    # Check if projects exist, if not, create them
    if Project.objects.count() == 0:
        projects_list = [
            {
                "title": "Quantum SaaS Dashboard",
                "category": "Web Application Development",
                "description": "Custom CRM and real-time dashboard tracking analytics, integrated with Python and MySQL.",
                "client_name": "Quantum Inc.",
                "revenue_generated": "$2.4M+",
                "growth_rate": "+310%",
                "is_featured": True
            },
            {
                "title": "Aura Luxury E-Commerce",
                "category": "E-Commerce Development",
                "description": "High-end jewelry web experience with custom Shopify Headless / Django infrastructure.",
                "client_name": "Aura Jewelry",
                "revenue_generated": "$1.8M+",
                "growth_rate": "+185%",
                "is_featured": True
            },
            {
                "title": "Apex Global SEO Dominance",
                "category": "Search Engine Optimization (SEO)",
                "description": "Full-scale technical SEO and content overhaul, taking organic ranking from page 10 to page 1.",
                "client_name": "Apex Logistics",
                "revenue_generated": "$850K+",
                "growth_rate": "+450%",
                "is_featured": True
            },
            {
                "title": "NeuroAI Lead Engine",
                "category": "AI Automation & Lead Gen",
                "description": "Intelligent automated outbound funnel integrating OpenAI APIs with custom landing page design.",
                "client_name": "NeuroAI",
                "revenue_generated": "$1.1M+",
                "growth_rate": "+240%",
                "is_featured": True
            }
        ]
        for p in projects_list:
            Project.objects.create(
                title=p["title"],
                category=p["category"],
                description=p["description"],
                client_name=p["client_name"],
                revenue_generated=p["revenue_generated"],
                growth_rate=p["growth_rate"],
                is_featured=p["is_featured"]
            )

def home(request):
    get_or_create_default_data()
    services = Service.objects.all()
    projects = Project.objects.all()
    
    # Categorize services for easy rendering in templates
    categories = {
        'SEO': services.filter(category='SEO'),
        'Marketing': services.filter(category='Marketing'),
        'Design': services.filter(category='Design'),
        'Development': services.filter(category='Development'),
        'Automation': services.filter(category='Automation')
    }
    
    context = {
        'services': services,
        'projects': projects,
        'categories': categories,
    }
    return render(request, 'index.html', context)

@csrf_exempt
def contact_submit(request):
    if request.method == 'POST':
        try:
            # Handle standard form or JSON AJAX request
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST

            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone', '')
            service_type = data.get('service_type', '')
            message = data.get('message', '')

            if not name or not email or not message:
                return JsonResponse({'status': 'error', 'message': 'Please fill out all required fields.'}, status=400)

            submission = ContactSubmission.objects.create(
                name=name,
                email=email,
                phone=phone,
                service_type=service_type,
                message=message
            )

            return JsonResponse({
                'status': 'success',
                'message': 'Thank you! Your request for consultation has been received. Our team will contact you shortly.',
                'submission_id': submission.id
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Server error: {str(e)}'}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Only POST method is allowed.'}, status=405)

