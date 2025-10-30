% academcv.cls - Academic CV Class
% A modern, professional LaTeX class for academic CVs
% Compatible with pdfLaTeX

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{academcv}[2024/01/01 v1.0 Academic CV Class]

% ---- Base Class ----
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax
\LoadClass[11pt,a4paper]{article}

% ---- Required Packages ----
\RequirePackage[margin=0.75in]{geometry}
\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}
\RequirePackage{libertinus}  % Libertinus font family
\RequirePackage{microtype}
\RequirePackage[svgnames]{xcolor}
\RequirePackage{titlesec}
\RequirePackage{enumitem}
\RequirePackage{array}
\RequirePackage{tabularx}
\RequirePackage{fontawesome}
\RequirePackage{calc}
\RequirePackage{ifthen}
\RequirePackage{etoolbox}
\RequirePackage[hidelinks]{hyperref}

% Define missing FontAwesome icons as fallbacks
\providecommand{\faOrcid}{\faExternalLink}
\providecommand{\faMapMarker}{\faHome}

% ---- Color Scheme ----
\definecolor{cvheader}{RGB}{51, 102, 153}      % Professional blue
\definecolor{cvsection}{RGB}{51, 102, 153}     % Section headers
\definecolor{cvgray}{RGB}{102, 102, 102}       % Gray text
\definecolor{cvdarkgray}{RGB}{68, 68, 68}      % Dark gray
\definecolor{cvlightgray}{RGB}{240, 240, 240}  % Light gray background

% ---- Font Settings ----
% Use Libertinus Sans as the main font
\renewcommand{\familydefault}{\sfdefault}
% Libertinus Sans for both body and headers
\renewcommand{\rmdefault}{LibertinusSerif-TLF}  % Libertinus Serif for emphasis
\renewcommand{\sfdefault}{LibertinusSans-TLF}   % Libertinus Sans as main font

% ---- Personal Information Variables ----
\newcommand*{\Name}[1]{\def\@name{#1}}
\newcommand*{\Affiliation}[1]{\def\@affiliation{#1}}
\newcommand*{\Email}[1]{\def\@email{#1}}
\newcommand*{\Homepage}[1]{\def\@homepage{#1}}
\newcommand*{\Github}[1]{\def\@github{#1}}
\newcommand*{\LinkedIn}[1]{\def\@linkedin{#1}}
\newcommand*{\Orcid}[1]{\def\@orcid{#1}}
\newcommand*{\Phone}[1]{\def\@phone{#1}}
\newcommand*{\Location}[1]{\def\@location{#1}}

% ---- Header Command ----
\newcommand{\makecvheader}{
    \begin{center}
        % Name
        {\LARGE\sffamily\bfseries\color{cvheader}\@name}
        
        \vspace{0.3em}
        
        % Affiliation
        \ifdef{\@affiliation}{
            {\large\sffamily\color{cvdarkgray}\@affiliation}
            \vspace{0.2em}
        }{}
        
        % Contact Information
        \begin{tabular}{l}
            \ifdef{\@email}{\faEnvelope\ \href{mailto:\@email}{\@email}}{}
            \ifdef{\@phone}{\quad\faPhone\ \@phone}{}
            \ifdef{\@location}{\quad\faMapMarker\ \@location}{} \\
            \vspace{0.1em}
            \ifdef{\@homepage}{\faGlobe\ \href{\@homepage}{\@homepage}}{}
            \ifdef{\@github}{\quad\faGithub\ \href{https://github.com/\@github}{\@github}}{}
            \ifdef{\@linkedin}{\quad\faLinkedin\ \href{https://linkedin.com/in/\@linkedin}{\@linkedin}}{}
            \ifdef{\@orcid}{\quad\faOrcid\ \href{https://orcid.org/\@orcid}{\@orcid}}{}
        \end{tabular}
    \end{center}
    % \hrule
}

% ---- Section Formatting ----
\titleformat{\section}
    {\Large\sffamily\bfseries\color{cvsection}}
    {}
    {0em}
    {}
    [\vspace{-0.3em}\hrule\vspace{0.1em}]

\titlespacing*{\section}{0pt}{0.7em}{0.2em}

% Custom section command
\newcommand{\cvsection}[1]{
    \section*{#1}
}

% ---- CV Entry Command ----
\newcommand{\cventry}[5]{
    \begin{tabularx}{\textwidth}{@{}l X r@{}}
        \textbf{#2} & & \textcolor{cvgray}{#1} \\
        \textcolor{cvdarkgray}{#3} & & \textcolor{cvgray}{#4} \\
        \multicolumn{3}{@{}p{\textwidth}@{}}{\textcolor{cvgray}{#5}}
        
    \end{tabularx}
    \vspace{-0.2em}
    
}

% ---- Skills ----
\newcommand{\skill}[1]{
    \colorbox{cvlightgray}{\textcolor{cvdarkgray}{\small\textbf{#1}}}
}

% ---- Multi-column Environment ----
\newenvironment{cvcolumns}[1][2]{
    \begin{minipage}{\textwidth}
    \setlength{\columnsep}{2em}
    \begin{multicols}{#1}
}{
    \end{multicols}
    \end{minipage}
}

% ---- Page Layout ----
\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0.1em}

% ---- List Formatting ----
\setlist[itemize]{
    leftmargin=1.2em,
    itemsep=0.1em,
    parsep=0pt,
    topsep=0.3em
}

% ---- Bibliography Customization ----
\AtBeginDocument{
    \@ifpackageloaded{biblatex}{
        % Custom bibliography formatting
        \renewcommand*{\mkbibnamegiven}[1]{%
            \ifboolexpr{ test {\ifdefstring{\namepartfamily}{\@name}} }
                {\mkbibbold{#1}}
                {#1}%
        }
        \renewcommand*{\mkbibnamefamily}[1]{%
            \ifboolexpr{ test {\ifdefstring{\namepartfamily}{\@name}} }
                {\mkbibbold{#1}}
                {#1}%
        }
        
        % Remove "In:" prefix
        \renewbibmacro{in:}{}
        
        % Custom number formatting
        \DeclareFieldFormat{labelnumberwidth}{\textcolor{cvsection}{\textbf{[#1]}}}
        
        % Compact bibliography spacing
        \setlength{\bibitemsep}{0.3em}
        \setlength{\bibnamesep}{0pt}
        \setlength{\bibinitsep}{0pt}
    }{}
}

% ---- Hyperlink Colors ----
\hypersetup{
    colorlinks=true,
    linkcolor=cvheader,
    filecolor=cvheader,
    urlcolor=cvheader,
    citecolor=cvheader
}

% ---- Additional Utilities ----
\newcommand{\cvhighlight}[1]{\textcolor{cvheader}{\textbf{#1}}}
\newcommand{\cvsubsection}[1]{
    \vspace{0.5em}
    {\large\textbf{\textcolor{cvsection}{#1}}}
    \vspace{0.3em}
}

% Add missing multicol package
\RequirePackage{multicol}

\endinput
