/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.daw.control;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.daw.bean.UsuarioBean;
import net.daw.dao.UsuarioDao;
import net.daw.helper.Conexion;

/**
 *
 * @author rafa
 */
public class ControlJsp extends HttpServlet {

    private static final long serialVersionUID = 1L;

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, Exception {
        //cabecera de la respuesta HTTP
        response.setHeader("page language", "java");
        response.setHeader("contentType", "text/html");
        response.setHeader("pageEncoding", "UTF-8");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        //carga de parámetros
        String op = request.getParameter("op");
        String ob = request.getParameter("ob");
        String mode = request.getParameter("mode");
        //gestión de la seguridad mediante modificación de la petición
        if (op == null) {
            op = "inicio";
        }
        if (ob == null) {
            ob = "usuario";
        }
        if (request.getSession().getAttribute("usuarioBean") == null) {
            ob = "usuario";
            if (!op.equals("inicio") && !op.equals("login02")) {
                op = "login01";
            }
        }
        //servimos la página jsp        
        if (mode != null) {
            //servimos el jsp aislado
            response.setContentType("text/html; charset=UTF-8");
            getServletContext().getRequestDispatcher("/jsp/" + ob + "/" + op + ".jsp").forward(request, response);
        } else {
            //procesamos la autenticación
            if (ob.equalsIgnoreCase("usuario")) {
                if (op.equalsIgnoreCase("login02")) {
                    UsuarioBean oUsuario = new UsuarioBean();

                    String login = request.getParameter("login");
                    String pass = request.getParameter("password");

                    if (!login.equals("") && !pass.equals("")) {
                        oUsuario.setLogin(login);
                        oUsuario.setPassword(pass);
                        UsuarioDao oUsuarioDao = new UsuarioDao(Conexion.getConection());
                        oUsuario = oUsuarioDao.getFromLogin(oUsuario);
                        if (oUsuario.getId() != 0) {
                            //rellena el tipo de usuario
      //comentadoprofesor                      oUsuario = oUsuarioDao.type(oUsuario);
                            request.getSession().setAttribute("usuarioBean", oUsuario);
                        }
//                        if (oUsuario.getId() != 0) {
//                            oUsuario = oUsuarioDao.get(oUsuario);
//                            if (oUsuario.getLogin().equals(login) && oUsuario.getPassword().equals(pass)) {
//                                request.getSession().setAttribute("usuarioBean", oUsuario);
//                            }
//                        }
                    }
                }
                if (op.equalsIgnoreCase("logout")) {
                    request.getSession().invalidate();
                }
            }
            //servimos el jsp dentro de index.jsp
            request.setAttribute("contenido", "jsp/" + ob + "/" + op + ".jsp");
            getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);

        }
    }

// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);

        } catch (Exception ex) {
            Logger.getLogger(ControlJsp.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (Exception ex) {
            Logger.getLogger(ControlJsp.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "jsp controller";
    }// </editor-fold>
}
