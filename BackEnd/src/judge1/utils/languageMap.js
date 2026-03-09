export const getOnlineCompilerId = (language) => {
    switch (language.toLowerCase()) {
        case 'python':
        case 'python3':
            return 'python-3.14';
        case 'cpp':
        case 'c++':
            return 'g++-15';
        case 'java':
            return 'openjdk-25';
        case 'go':
            return 'go-1.26';
        case 'rust':
            return 'rust-1.93';
        case 'php':
            return 'php-8.5';
        case 'ruby':
            return 'ruby-4.0';
        default:
            return null;
    }
}
